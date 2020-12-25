import firebase from '../config/firebase';

const db = firebase.firestore();

export const dataFromSnapshot = (snapshot) => {
  if (!snapshot.exists) {
    return;
  }

  const data = snapshot.data();

  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof firebase.firestore.Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }

  return {
    ...data,
    id: snapshot.id,
  };
};

export const listenToEventsFromFirestore = (predicate) => {
  const user = firebase.auth().currentUser;
  let eventRef = db.collection('events').orderBy('date');

  switch (predicate.get('filter')) {
    case 'isGoing':
      return eventRef
        .where('attendeeIds', 'array-contains', user.uid)
        .where('date', '>=', predicate.get('startDate'));
    case 'isHost':
      return eventRef
        .where('hostUid', '==', user.uid)
        .where('date', '>=', predicate.get('startDate'));
    default:
      return eventRef.where('date', '>=', predicate.get('startDate'));
  }
};

export const listenToEventFromFirestore = (eventId) => {
  return db.collection('events').doc(eventId);
};

export const addEventToFirestore = (event) => {
  const user = firebase.auth().currentUser;
  return db.collection('events').add({
    ...event,
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: user.photoURL,
    attendees: firebase.firestore.FieldValue.arrayUnion({
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }),
    attendeeIds: firebase.firestore.FieldValue.arrayUnion(user.uid),
  });
};

export const updateEventInFirestore = (event) => {
  return db.collection('events').doc(event.id).update(event);
};

export const deleteEventInFirestore = (eventId) => {
  return db.collection('events').doc(eventId).delete();
};

export const cancelEventToggle = (event) => {
  return db.collection('events').doc(event.id).update({
    isCancelled: !event.isCancelled,
  });
};

export function setUserProfileData(user) {
  return db
    .collection('users')
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

export function getUserProfile(userId) {
  return db.collection('users').doc(userId);
}

export async function updateUserProfile(profile) {
  const user = firebase.auth().currentUser;

  try {
    if (user.displayName !== profile.displayName) {
      user.updateProfile({
        displayName: profile.displayName,
        description: profile.description,
      });
    }
    await db.collection('users').doc(user.uid).update(profile);
  } catch (error) {
    throw error;
  }
}

export const updateUserProfilePhoto = async (downloadURL, filename) => {
  const user = firebase.auth().currentUser;
  const userDocRef = db.collection('users').doc(user.uid);
  try {
    const userDoc = await userDocRef.get();
    if (!userDoc.data().photoURL) {
      await db.collection('users').doc(user.uid).update({
        photoURL: downloadURL,
      });
      await user.updateProfile({
        photoURL: downloadURL,
      });
    }
    return await db.collection('users').doc(user.uid).collection('photos').add({
      name: filename,
      url: downloadURL,
    });
  } catch (error) {
    throw error;
  }
};

export const getUserPhotos = (userUid) => {
  return db.collection('users').doc(userUid).collection('photos');
};

export const setMainPhoto = async (photo) => {
  const user = firebase.auth().currentUser;
  try {
    await db.collection('users').doc(user.uid).update({
      photoURL: photo.url,
    });
    return await user.updateProfile({
      photoURL: photo.url,
    });
  } catch (error) {
    throw error;
  }
};

export const deletePhotoFromCollection = (photoId) => {
  const userUid = firebase.auth().currentUser.uid;
  return db
    .collection('users')
    .doc(userUid)
    .collection('photos')
    .doc(photoId)
    .delete();
};

export const addUserAttendance = (event) => {
  const user = firebase.auth().currentUser;

  return db
    .collection('events')
    .doc(event.id)
    .update({
      attendees: firebase.firestore.FieldValue.arrayUnion({
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }),
      attendeeIds: firebase.firestore.FieldValue.arrayUnion(user.uid),
    });
};

export const cancelUserAttendance = async (event) => {
  const user = firebase.auth().currentUser;

  try {
    const eventDoc = await db.collection('events').doc(event.id).get();
    return db
      .collection('events')
      .doc(event.id)
      .update({
        attendeeIds: firebase.firestore.FieldValue.arrayRemove(user.uid),
        attendees: eventDoc
          .data()
          .attendees.filter((attendee) => attendee.id !== user.uid),
      });
  } catch (error) {
    throw error;
  }
};

export const getUserEventsQuery = (activeTab, userUid) => {
  let eventsRef = db.collection('events');
  const today = new Date();
  switch (activeTab) {
    case 1: // past events
      return eventsRef
        .where('attendeeIds', 'array-contains', userUid)
        .where('date', '<=', today)
        .orderBy('date', 'desc');
    case 2: // hosting
      return eventsRef.where('hostUid', '==', userUid).orderBy('date');
    default:
      // future events
      return eventsRef
        .where('attendeeIds', 'array-contains', userUid)
        .where('date', '>=', today)
        .orderBy('date');
  }
};

export const followUser = async (profile) => {
  const user = firebase.auth().currentUser;
  const batch = db.batch();
  try {
    batch.set(
      db
        .collection('following')
        .doc(user.uid)
        .collection('userFollowing')
        .doc(profile.id),
      {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        uid: profile.id,
      }
    );

    batch.set(
      db
        .collection('following')
        .doc(profile.id)
        .collection('userFollowers')
        .doc(user.uid),
      {
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      }
    );

    batch.update(db.collection('users').doc(user.uid), {
      followingCound: firebase.firestore.FieldValue.increment(1),
    });

    batch.update(db.collection('users').doc(profile.id), {
      followerCound: firebase.firestore.FieldValue.increment(1),
    });
    return await batch.commit();
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = async (profile) => {
  const user = firebase.auth().currentUser;
  const batch = db.batch();
  try {
    batch.delete(
      db
        .collection('following')
        .doc(user.uid)
        .collection('userFollowing')
        .doc(profile.id)
    );

    batch.delete(
      db
        .collection('following')
        .doc(profile.id)
        .collection('userFollowers')
        .doc(user.uid)
    );

    batch.update(db.collection('users').doc(user.uid), {
      followingCound: firebase.firestore.FieldValue.increment(-1),
    });

    batch.update(db.collection('users').doc(profile.id), {
      followerCound: firebase.firestore.FieldValue.increment(-1),
    });

    return await batch.commit();
  } catch (error) {
    throw error;
  }
};

export function getFollowersCollection(profileId) {
  return db.collection('following').doc(profileId).collection('userFollowers');
}

export function getFollowingCollection(profileId) {
  return db.collection('following').doc(profileId).collection('userFollowing');
}

export function getFollowingDoc(profileId) {
  const userUid = firebase.auth().currentUser.uid;
  return db
    .collection('following')
    .doc(userUid)
    .collection('userFollowing')
    .doc(profileId)
    .get();
}

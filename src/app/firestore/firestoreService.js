import cuid from 'cuid';
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

export const listenToEventsFromFirestore = () => {
  return db.collection('events').orderBy('date');
};

export const listenToEventFromFirestore = (eventId) => {
  return db.collection('events').doc(eventId);
};

export const addEventToFirestore = (event) => {
  return db.collection('events').add({
    ...event,
    hostedBy: 'Diana',
    hostPhotoURL: 'https://randomuser.me/api/portraits/women/34.jpg',
    attendees: firebase.firestore.FieldValue.arrayUnion({
      id: cuid(),
      displayName: 'Diana',
      photoURL: 'https://randomuser.me/api/portraits/women/34.jpg',
    }),
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
        description: profile.description
      });
    }
    await db.collection('users').doc(user.uid).update(profile);
  } catch (error) {
    throw error;
  }
}

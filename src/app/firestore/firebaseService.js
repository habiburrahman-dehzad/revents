import { toast } from 'react-toastify';
import firebase from '../config/firebase';
import { setUserProfileData } from './firestoreService';

export const signInWithEmail = (creds) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(creds.email, creds.password);
};

export const signOutFirebase = () => {
  return firebase.auth().signOut();
};

export async function registerInFirebase(creds) {
  try {
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(creds.email, creds.password);
    await result.user.updateProfile({
      displayName: creds.displayName,
    });
    return await setUserProfileData(result.user);
  } catch (error) {
    throw error;
  }
}

export const socialLogin = async (selectedProvider) => {
  let provider;
  if (selectedProvider === 'facebook')
  {
    provider = new firebase.auth.FacebookAuthProvider();
  }
  else if (selectedProvider === 'google')
  {
    provider = new firebase.auth.GoogleAuthProvider();
  }

  try {
    const result = await firebase.auth().signInWithPopup(provider);
    console.log(result);
    if (result.additionalUserInfo.isNewUser) {
      await setUserProfileData(result.user);
    }
  } catch (error) {
    toast.error(error.message);
  }
}

export const updateUserPassword = (creds) => {
  const user = firebase.auth().currentUser;
  return user.updatePassword(creds.newPassword1);
}

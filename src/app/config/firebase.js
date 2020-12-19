import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: 'AIzaSyAos4-uGDTL-vGw_ouhtWzTnJDVJPl100E',
  authDomain: 'revents-5805d.firebaseapp.com',
  projectId: 'revents-5805d',
  storageBucket: 'revents-5805d.appspot.com',
  messagingSenderId: '7102019086',
  appId: '1:7102019086:web:fe6a820a0b47cae1642e5f',
  measurementId: 'G-D89QRS97ED',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
firebase.firestore();

export default firebase;

import firebase from "firebase/app";

import "firebase/firestore";
import "firebase/auth";
import "firebase/functions"


const functionsConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_MESSAGING_APP_ID
};

firebase.initializeApp(functionsConfig);


export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const functions = firebase.functions();

// if(window.location.hostname.includes('localhost*')){
//   auth.useEmulator('http://localhost:4000');
//   firestore.useEmulator('localhost', 8080);
//   functions.useEmulator('localhost',5001);
// }


export default firebase;

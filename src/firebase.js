import firebase from "firebase/app";

import "firebase/firestore";
import "firebase/auth";
import "firebase/functions"


const functionsConfig = {
  apiKey: "AIzaSyCof-erH69cwajvtC9wcKnSAprPpDgVFNc",
  authDomain: "tutorial-functions-b4b13.firebaseapp.com",
  projectId: "tutorial-functions-b4b13",
  storageBucket: "tutorial-functions-b4b13.appspot.com",
  messagingSenderId: "987555003778",
  appId: "1:987555003778:web:b5814e285d06196517639b"
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

import firebase from'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCTwjE-3q-f8xlQTjJKrWucWdd8AEdqrEs",
    authDomain: "family-manager371.firebaseapp.com",
    databaseURL: "https://family-manager371.firebaseio.com",
    projectId: "family-manager371",
    storageBucket: "family-manager371.appspot.com",
    messagingSenderId: "217700202656",
    appId: "1:217700202656:web:063fdc91655cafa3cb71c5",
    measurementId: "G-K9YFFLSQ3E"
  };

firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;

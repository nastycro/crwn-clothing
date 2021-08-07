import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAwnt-XvayauhWFhIQwpFL-PH52FH36pzQ",
    authDomain: "crwn-db-485af.firebaseapp.com",
    projectId: "crwn-db-485af",
    storageBucket: "crwn-db-485af.appspot.com",
    messagingSenderId: "715327509403",
    appId: "1:715327509403:web:e030b7a9c1dc735ede073e",
    measurementId: "G-D70LDVKRHM"
  };


  export const createUserProfileDocument = async (userAuth, additionalData) => {
      if (!userAuth) return;

      const userRef = firestore.doc(`users/${userAuth.uid}`);

      const snapShot = await userRef.get();

      if(!snapShot.exists) {
          const { displayName, email } = userAuth;
          const createdAt = new Date();

          try {
              await userRef.set({
                  displayName,
                  email,
                  createdAt,
                  ...additionalData
              })
          } catch (error) {
              console.log('error creating user', error.message)
          }
      }

      return userRef;
  };



  firebase.initializeApp(config);

  export const auth = firebase.auth();
  export const firestore = firebase.firestore();

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ promt: 'select_account' });
  export const signInWithGoogle = () => auth.signInWithPopup(provider);

  export default firebase;

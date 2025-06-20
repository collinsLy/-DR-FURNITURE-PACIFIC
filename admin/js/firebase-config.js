// Firebase configuration
// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-G1rhKKGLDbN2dFF1vbcUVUxumnSC5Lo",
  authDomain: "dr-furniture-pacific.firebaseapp.com",
  projectId: "dr-furniture-pacific",
  storageBucket: "dr-furniture-pacific.firebasestorage.app",
  messagingSenderId: "1076749004365",
  appId: "1:1076749004365:web:c50148abae9ce2904bb604",
  measurementId: "G-FDKC573E1J"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable Firestore offline persistence if needed
// db.enablePersistence()
//   .catch((err) => {
//     if (err.code == 'failed-precondition') {
//       // Multiple tabs open, persistence can only be enabled in one tab at a time
//       console.log('Persistence failed');
//     } else if (err.code == 'unimplemented') {
//       // The current browser does not support all of the features required to enable persistence
//       console.log('Persistence is not available');
//     }
//   });

// Firestore settings
db.settings({
  timestampsInSnapshots: true
});
// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQxVJzNjYw8PYvPJqKqKqKqKqKqKqKqKq",
  authDomain: "raffle-draw-app-alph1tech.firebaseapp.com",
  databaseURL: "https://raffle-draw-app-alph1tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "raffle-draw-app-alph1tech",
  storageBucket: "raffle-draw-app-alph1tech.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const realtimedb = firebase.database();
const auth = firebase.auth();

console.log('🟢 [FIREBASE] Configuration loaded');

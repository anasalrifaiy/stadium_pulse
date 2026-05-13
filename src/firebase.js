import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDSv8Rv0WflDYgJMp0-2aloFZu3VS5379o",
  authDomain: "football-quiz-dfdf6.firebaseapp.com",
  databaseURL: "https://football-quiz-dfdf6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "football-quiz-dfdf6",
  storageBucket: "football-quiz-dfdf6.firebasestorage.app",
  messagingSenderId: "413139971118",
  appId: "1:413139971118:web:5d19f848e63b66372483bf",
  measurementId: "G-75PYGGY706"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

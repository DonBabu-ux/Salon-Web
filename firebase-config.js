// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKhQx0H0dyuT6_QGHgK42djUvzVKxvgvo",
  authDomain: "mama-waithira-salon-web.firebaseapp.com",
  projectId: "mama-waithira-salon-web",
  storageBucket: "mama-waithira-salon-web.firebasestorage.app",
  messagingSenderId: "27704869413",
  appId: "1:27704869413:web:f3ef1af0f85ef3e3bbf5cc",
  measurementId: "G-82HR9NQNZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

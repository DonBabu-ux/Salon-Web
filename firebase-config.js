// firebase-config.js

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getAnalytics } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

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

// Initialize services
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

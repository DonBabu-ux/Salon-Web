// ================================
// Firebase + Auth Setup
// ================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKhQx0H0dyuT6_QGHgK42djUvzVKxvgvo",
  authDomain: "mama-waithira-salon-web.firebaseapp.com",
  projectId: "mama-waithira-salon-web",
  storageBucket: "mama-waithira-salon-web.firebasestorage.app",
  messagingSenderId: "27704869413",
  appId: "1:27704869413:web:f3ef1af0f85ef3e3bbf5cc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ================================
// SIGNUP
// ================================
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        if (!email || !password) {
            alert("Email and password required");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
            window.location.href = "dashboard.html";
        } catch (error) {
            alert(error.message);
        }
    });
}

// ================================
// LOGIN
// ================================
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        if (!email || !password) {
            alert("Email and password required");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "dashboard.html";
        } catch (error) {
            alert(error.message);
        }
    });
}

// ================================
// LOGOUT
// ================================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "index.html";
    });
}

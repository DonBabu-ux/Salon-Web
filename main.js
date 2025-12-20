import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// -----------------------------
// Firebase Config
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAkMFYizmJ4dd8G8oJ9uw1JdgzwhtmsENU",
  authDomain: "mywebapp-bb780.firebaseapp.com",
  projectId: "mywebapp-bb780",
  storageBucket: "mywebapp-bb780.firebasestorage.app",
  messagingSenderId: "1020137155241",
  appId: "1:1020137155241:web:7541eebf3d9e0263d897b8",
  measurementId: "G-W9GHSVS9T3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// -----------------------------
// Signup
// -----------------------------
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        if (!email || !password) return alert("Email and password required");

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
            window.location.href = "dashboard.html";
        } catch (error) {
            alert(error.message);
        }
    });
}

// -----------------------------
// Login
// -----------------------------
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        if (!email || !password) return alert("Email and password required");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "dashboard.html";
        } catch (error) {
            alert(error.message);
        }
    });
}

// -----------------------------
// Logout
// -----------------------------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "index.html";
    });
}

// -----------------------------
// Protect Dashboard
// -----------------------------
if (window.location.pathname.includes("dashboard.html")) {
    onAuthStateChanged(auth, user => {
        if (!user) window.location.href = "index.html";
    });
}

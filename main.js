import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// Firebase config
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
// ADMIN CONFIG
// -----------------------------
const adminEmails = ["donthetechie@gmail.com"]; // List of admin users

function isAdmin(email){
  return adminEmails.includes(email);
}

// -----------------------------
// SIGNUP
// -----------------------------
const signupBtn = document.getElementById("signupBtn");
if(signupBtn){
  signupBtn.addEventListener("click", async ()=>{
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    if(!email || !password) return alert("Email and password required");

    try{
      await createUserWithEmailAndPassword(auth,email,password);
      alert("Account created successfully!");
      window.location.href="dashboard.html";
    }catch(e){ alert(e.message); }
  });
}

// -----------------------------
// LOGIN
// -----------------------------
const loginBtn = document.getElementById("loginBtn");
if(loginBtn){
  loginBtn.addEventListener("click", async ()=>{
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    if(!email || !password) return alert("Email and password required");

    try{
      await signInWithEmailAndPassword(auth,email,password);
      if(isAdmin(email)){
        window.location.href="admin.html";
      }else{
        window.location.href="dashboard.html";
      }
    }catch(e){ alert(e.message); }
  });
}

// -----------------------------
// LOGOUT
// -----------------------------
const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn){
  logoutBtn.addEventListener("click", async ()=>{
    await signOut(auth);
    window.location.href="index.html";
  });
}

// -----------------------------
// PROTECT DASHBOARD
// -----------------------------
if(window.location.pathname.includes("dashboard.html")){
  onAuthStateChanged(auth,user=>{
    if(!user) window.location.href="index.html";
  });
}

// -----------------------------
// PROTECT ADMIN PANEL + LOAD BOOKINGS
// -----------------------------
const adminListEl = document.getElementById("adminList");
if(window.location.pathname.includes("admin.html")){
  onAuthStateChanged(auth, async (user)=>{
    if(!user) { document.body.innerHTML="<p style='padding:30px'>Access denied — login required</p>"; return; }
    if(!isAdmin(user.email)){ document.body.innerHTML="<p style='padding:30px'>Access denied — admin only</p>"; return; }

    // Load bookings
    if(adminListEl){
      import("./booking.js").then(async module=>{
        const list = await module.listAllBookings();
        if(!list.length){
          adminListEl.innerHTML="<div class='small'>No bookings yet</div>";
        } else{
          adminListEl.innerHTML="";
          list.forEach(item=>{
            const d=document.createElement("div");
            d.className="booking-item";
            d.innerHTML=`
              <div class="booking-info">
                <strong>${item.service}</strong>
                <div class="small">${item.date} • ${item.time}</div>
                <div class="small">${item.email}</div>
              </div>
              <div class="booking-actions">
                <button class="btn secondary" data-id="${item.id}">Delete</button>
              </div>
            `;
            adminListEl.appendChild(d);
          });

          // Attach delete handlers
          adminListEl.querySelectorAll("button[data-id]").forEach(btn=>{
            btn.addEventListener("click", async (e)=>{
              const id=e.target.dataset.id;
              if(!confirm("Delete booking?")) return;
              await module.deleteBooking(id);
              alert("Deleted");
              location.reload();
            });
          });
        }
      });
    }
  });
}

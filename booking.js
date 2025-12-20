import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// -----------------------------
// USER: Add Booking (NOW PENDING)
// -----------------------------
export async function book(service, price, date, time) {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to book");
    return;
  }

  await addDoc(collection(db, "bookings"), {
    service,
    price,
    date,
    time,
    email: user.email,
    uid: user.uid,
    status: "pending",
    createdAt: serverTimestamp()
  });

  alert("Booking submitted and pending approval");
}


// -----------------------------
// ADMIN: List All Bookings
// -----------------------------
export async function listAllBookings() {
  const querySnap = await getDocs(collection(db, "bookings"));
  const list = [];
  querySnap.forEach(d => {
    list.push({ id: d.id, ...d.data() });
  });
  return list;
}

// -----------------------------
// ADMIN: Approve Booking
// -----------------------------
export async function approveBooking(id) {
  await updateDoc(doc(db, "bookings", id), {
    status: "approved"
  });
}

// -----------------------------
// ADMIN: Reject Booking
// -----------------------------
export async function rejectBooking(id) {
  await updateDoc(doc(db, "bookings", id), {
    status: "rejected"
  });
}

// -----------------------------
// ADMIN: Delete Booking (optional)
// -----------------------------
export async function deleteBooking(id) {
  await deleteDoc(doc(db, "bookings", id));
}

// -----------------------------
// USER: Load Own Bookings + Status
// -----------------------------
export async function loadUserBookings(elementId) {
  const listEl = document.getElementById(elementId);
  if (!listEl) return;

  const user = auth.currentUser;
  if (!user) return;

  listEl.innerHTML = "";

  const querySnap = await getDocs(collection(db, "bookings"));
  querySnap.forEach(d => {
    const data = d.data();
    if (data.uid === user.uid) {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${data.service}</strong> - KSh ${data.price}<br>
        ${data.date}<br>
        <span>Status: <b>${data.status}</b></span>
      `;
      listEl.appendChild(li);
    }
  });
}


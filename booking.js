import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
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
// Add Booking
// -----------------------------
export async function book(service, price) {
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in to book!");

  await addDoc(collection(db, "bookings"), {
    service,
    price,
    date: new Date().toLocaleString(),
    email: user.email,    // store user info
    uid: user.uid
  });

  alert("Booked successfully!");
}

// -----------------------------
// List All Bookings (for admin)
// -----------------------------
export async function listAllBookings() {
  const querySnap = await getDocs(collection(db, "bookings"));
  const list = [];
  querySnap.forEach(doc => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list;
}

// -----------------------------
// Delete Booking (for admin)
// -----------------------------
export async function deleteBooking(id) {
  await deleteDoc(doc(db, "bookings", id));
}

// -----------------------------
// Load Bookings for User Dashboard
// -----------------------------
export async function loadUserBookings(elementId) {
  const listEl = document.getElementById(elementId);
  if(!listEl) return;

  const user = auth.currentUser;
  if(!user) return;

  listEl.innerHTML = "";

  const querySnap = await getDocs(collection(db, "bookings"));
  querySnap.forEach(doc => {
    const data = doc.data();
    if(data.uid === user.uid){
      const li = document.createElement("li");
      li.textContent = `${data.service} - KSh ${data.price} - ${data.date}`;
      listEl.appendChild(li);
    }
  });
}

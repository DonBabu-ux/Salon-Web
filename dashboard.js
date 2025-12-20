import { auth, db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const bookingListEl = document.getElementById("bookingList");

// Load bookings for current user
async function loadUserBookings() {
  const user = auth.currentUser;
  if (!user) {
    bookingListEl.innerHTML = "<li>Please login to view your bookings.</li>";
    return;
  }

  const q = query(
    collection(db, "bookings"),
    where("uid", "==", user.uid)
  );

  const snap = await getDocs(q);
  bookingListEl.innerHTML = "";

  if (snap.empty) {
    bookingListEl.innerHTML = "<li>No bookings yet.</li>";
    return;
  }

  snap.forEach(doc => {
    const b = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${b.service}</strong> - KSh ${b.price}<br>
      ${b.date} • ${b.time}<br>
      Status: <b>${b.status}</b>
    `;
    bookingListEl.appendChild(li);
  });
}

// Load bookings on auth state change
auth.onAuthStateChanged(user => {
  if (user) {
    loadUserBookings();
  } else {
    bookingListEl.innerHTML = "<li>Please login to view your bookings.</li>";
  }
});

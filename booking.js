import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";

/* =====================================================
   USER: CREATE BOOKING (PENDING)
===================================================== */
export async function book(service, price, date, time) {
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in to book");
    return;
  }

  if (!service || !date || !time) {
    alert("Incomplete booking details");
    return;
  }

  await addDoc(collection(db, "bookings"), {
    service,
    price: Number(price),
    date,
    time,
    email: user.email,
    uid: user.uid,
    status: "pending",
    createdAt: serverTimestamp()
  });

  alert("Booking submitted. Awaiting admin approval.");
}

/* =====================================================
   USER: LOAD OWN BOOKINGS
===================================================== */
export async function loadUserBookings(elementId) {
  const listEl = document.getElementById(elementId);
  if (!listEl) return;

  const user = auth.currentUser;
  if (!user) return;

  listEl.innerHTML = "";

  const q = query(
    collection(db, "bookings"),
    where("uid", "==", user.uid)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    listEl.innerHTML = "<li>No bookings yet</li>";
    return;
  }

  snap.forEach(d => {
    const b = d.data();

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${b.service}</strong><br>
      ${b.date} • ${b.time}<br>
      Price: KSh ${b.price}<br>
      Status: <b>${b.status}</b>
    `;

    listEl.appendChild(li);
  });
}

/* =====================================================
   ADMIN: LOAD ALL BOOKINGS
===================================================== */
export async function listAllBookings() {
  const snap = await getDocs(collection(db, "bookings"));
  const bookings = [];

  snap.forEach(d => {
    bookings.push({ id: d.id, ...d.data() });
  });

  return bookings;
}

/* =====================================================
   ADMIN: APPROVE BOOKING
===================================================== */
export async function approveBooking(id) {
  await updateDoc(doc(db, "bookings", id), {
    status: "approved"
  });
}

/* =====================================================
   ADMIN: REJECT BOOKING
===================================================== */
export async function rejectBooking(id) {
  await updateDoc(doc(db, "bookings", id), {
    status: "rejected"
  });
}

/* =====================================================
   ADMIN: DELETE BOOKING (OPTIONAL)
===================================================== */
export async function deleteBooking(id) {
  await deleteDoc(doc(db, "bookings", id));
}

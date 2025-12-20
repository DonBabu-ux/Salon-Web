import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot
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
   USER: LOAD OWN BOOKINGS (REAL-TIME)
===================================================== */
export function loadUserBookings(elementId) {
  const listEl = document.getElementById(elementId);
  if (!listEl) return;

  auth.onAuthStateChanged(user => {
    if (!user) return;

    const q = query(collection(db, "bookings"), where("uid", "==", user.uid));

    onSnapshot(q, snap => {
      listEl.innerHTML = "";

      if (snap.empty) {
        listEl.innerHTML = "<li>No bookings yet</li>";
        return;
      }

      snap.forEach(d => {
        const b = d.data();

        const li = document.createElement("li");
        li.className = "booking-item";
        li.innerHTML = `
          <strong>${b.service}</strong><br>
          ${b.date} • ${b.time}<br>
          Price: KSh ${b.price}<br>
          Status: <b>${b.status}</b>
          ${b.status === "pending" ? `<button class="btn cancel" data-id="${d.id}">Cancel</button>` : ""}
        `;
        listEl.appendChild(li);
      });

      // Cancel pending bookings
      listEl.querySelectorAll(".cancel").forEach(btn => {
        btn.addEventListener("click", async e => {
          const id = e.target.dataset.id;
          if (!confirm("Cancel this booking?")) return;
          await deleteDoc(doc(db, "bookings", id));
          alert("Booking canceled");
        });
      });
    });
  });
}

/* =====================================================
   ADMIN: LOAD ALL BOOKINGS (REAL-TIME)
===================================================== */
export function loadAllBookingsAdmin(elementId) {
  const listEl = document.getElementById(elementId);
  if (!listEl) return;

  const q = collection(db, "bookings");

  onSnapshot(q, snap => {
    listEl.innerHTML = "";
    if (snap.empty) {
      listEl.innerHTML = "<div class='small'>No bookings yet</div>";
      return;
    }

    snap.forEach(d => {
      const b = d.data();
      const div = document.createElement("div");
      div.className = "booking-item";
      div.innerHTML = `
        <div class="booking-info">
          <strong>${b.service}</strong><br>
          ${b.date} • ${b.time}<br>
          ${b.email}<br>
          Price: KSh ${b.price}<br>
          Status: <b>${b.status}</b>
        </div>
        <div class="booking-actions">
          ${b.status === "pending" ? `
            <button class="btn approve" data-id="${d.id}">Approve</button>
            <button class="btn reject" data-id="${d.id}">Reject</button>` : ""}
          <button class="btn secondary delete" data-id="${d.id}">Delete</button>
        </div>
      `;
      listEl.appendChild(div);
    });

    // Admin actions
    listEl.querySelectorAll(".approve").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        await updateDoc(doc(db, "bookings", id), { status: "approved" });
      });
    });

    listEl.querySelectorAll(".reject").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        await updateDoc(doc(db, "bookings", id), { status: "rejected" });
      });
    });

    listEl.querySelectorAll(".delete").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        if (!confirm("Delete booking?")) return;
        await deleteDoc(doc(db, "bookings", id));
      });
    });
  });
}

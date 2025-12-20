import { auth, db } from "./firebase.js";
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { ensureAdmin } from "./adminCheck.js"; // your adminEmails file

// -----------------------------
// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  const { signOut } = await import("https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js");
  await signOut(auth);
  window.location.href = "index.html";
});

// -----------------------------
// Check if current user is admin
auth.onAuthStateChanged(user => {
  if (!user || !ensureAdmin(user.email)) {
    document.body.innerHTML = "<p style='padding:30px;font-size:1.2rem'>Access denied — admin only</p>";
    return;
  }

  loadBookingsAdmin();
});

// -----------------------------
// Load bookings in real-time
function loadBookingsAdmin() {
  const adminList = document.getElementById("adminList");
  const q = query(collection(db, "bookings"));

  onSnapshot(q, snap => {
    adminList.innerHTML = "";
    if (snap.empty) {
      adminList.innerHTML = "<div class='small'>No bookings yet</div>";
      return;
    }

    snap.forEach(d => {
      const b = d.data();
      const div = document.createElement("div");
      div.className = "booking-item";
      div.innerHTML = `
        <div class="booking-info">
          <strong>${b.service}</strong> <br>
          ${b.date} • ${b.time} <br>
          ${b.email} <br>
          Status: <b>${b.status}</b>
        </div>
        <div class="booking-actions">
          ${b.status === "pending" ? `
          <button class="btn approve" data-id="${d.id}">Approve</button>
          <button class="btn reject" data-id="${d.id}">Reject</button>` : ""}
          <button class="btn secondary delete" data-id="${d.id}">Delete</button>
        </div>
      `;
      adminList.appendChild(div);
    });

    // Add event listeners for approve/reject/delete
    adminList.querySelectorAll(".approve").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        await updateDoc(doc(db, "bookings", id), { status: "approved" });
      });
    });

    adminList.querySelectorAll(".reject").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        await updateDoc(doc(db, "bookings", id), { status: "rejected" });
      });
    });

    adminList.querySelectorAll(".delete").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        if (!confirm("Delete booking?")) return;
        await deleteDoc(doc(db, "bookings", id));
      });
    });
  });
}

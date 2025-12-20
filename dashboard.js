import { auth, db } from "./firebase.js";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

let selected = { service:null, price:null, date:null, time:null };
const timeSlots = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","01:00 PM","01:30 PM","02:00 PM","03:00 PM","04:00 PM"];

// -------------------------
// Render time slots
// -------------------------
function renderSlots(){
  const container = document.getElementById("timeSlots");
  container.innerHTML = "";
  timeSlots.forEach(t => {
    const b = document.createElement("button");
    b.className = "btn secondary";
    b.style.width = "100%";
    b.textContent = t;
    b.addEventListener("click", () => {
      selected.time = t;
      container.querySelectorAll("button").forEach(x => x.style.opacity = 0.7);
      b.style.opacity = 1;
    });
    container.appendChild(b);
  });
}

// -------------------------
// Select service
// -------------------------
document.querySelectorAll(".service-card .btn").forEach(btn=>{
  btn.addEventListener("click", ()=> {
    selected.service = btn.dataset.service;
    selected.price = btn.dataset.price;
    alert(`Selected ${selected.service}. Pick date & time, then confirm.`);
  });
});

// -------------------------
// Date picker
// -------------------------
document.getElementById("bookingDate").addEventListener("change", e => {
  selected.date = e.target.value;
});

// -------------------------
// Confirm booking
// -------------------------
document.getElementById("confirmBooking").addEventListener("click", async () => {
  if (!selected.service || !selected.date || !selected.time) {
    alert("Select service, date & time");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in");
    return;
  }

  await addDoc(collection(db, "bookings"), {
    service: selected.service,
    price: Number(selected.price),
    date: selected.date,
    time: selected.time,
    email: user.email,
    uid: user.uid,
    status: "pending",
    createdAt: serverTimestamp()
  });

  alert("Booking submitted and pending approval");
  selected = { service:null, price:null, date:null, time:null };
  document.getElementById("bookingDate").value = "";
});

// -------------------------
// Load bookings in real time
// -------------------------
auth.onAuthStateChanged(user => {
  if (!user) return;

  const bookingList = document.getElementById("bookingList");
  const q = query(collection(db, "bookings"), where("uid", "==", user.uid));

  onSnapshot(q, snap => {
    bookingList.innerHTML = "";
    if (snap.empty) {
      bookingList.innerHTML = "<li>No bookings yet</li>";
      return;
    }

    snap.forEach(d => {
      const b = d.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${b.service}</strong> - KSh ${b.price}<br>
        ${b.date} • ${b.time}<br>
        Status: <b>${b.status}</b>
      `;
      bookingList.appendChild(li);
    });
  });
});

// -------------------------
// Render time slots on load
// -------------------------
renderSlots();

// -------------------------
// Logout
// -------------------------
document.getElementById("logoutBtn").addEventListener("click", async ()=>{
  const { signOut } = await import("https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js");
  await signOut(auth);
  window.location.href = "index.html";
});

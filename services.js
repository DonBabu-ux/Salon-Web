import { auth, db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Array of beauty services
const services = [
  { name: "Haircut", price: 800, description: "Stylish haircut tailored to your look." },
  { name: "Manicure & Pedicure", price: 1200, description: "Beautiful nails and foot care." },
  { name: "Facial Treatment", price: 1500, description: "Rejuvenate your skin and glow." },
  { name: "Hair Coloring", price: 2500, description: "Change your hair color with style." },
  { name: "Makeup", price: 2000, description: "Professional makeup for any occasion." },
  { name: "Massage Therapy", price: 1800, description: "Relax and relieve tension." },
];

const container = document.getElementById("services-container");

// Render service cards
services.forEach(s => {
  const card = document.createElement("div");
  card.className = "service-card glass";

  card.innerHTML = `
    <h3>${s.name}</h3>
    <p class="desc">${s.description}</p>
    <p class="price">KSh ${s.price}</p>
    <button class="btn book-btn">Book Now</button>
  `;

  // Attach booking event
  const btn = card.querySelector(".book-btn");
  btn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to book.");
      window.location.href = "login.html";
      return;
    }

    const date = prompt("Enter booking date (YYYY-MM-DD):");
    if (!date) return alert("Date is required.");

    const time = prompt("Enter time (e.g., 10:00 AM):");
    if (!time) return alert("Time is required.");

    // Save booking in Firestore
    await addDoc(collection(db, "bookings"), {
      service: s.name,
      price: s.price,
      date,
      time,
      status: "pending",
      email: user.email,
      uid: user.uid,
      createdAt: serverTimestamp()
    });

    alert(`Booking for ${s.name} on ${date} at ${time} submitted successfully!`);

    // Optional: redirect to dashboard
    window.location.href = "dashboard.html";
  });

  container.appendChild(card);
});

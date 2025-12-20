import { auth } from "./firebase.js";
import { book, loadUserBookings } from "./booking.js";

// Array of beauty services
const services = [
    { name: "Haircut", price: 800, description: "Stylish haircut tailored to your look." },
    { name: "Manicure & Pedicure", price: 1200, description: "Beautiful nails and foot care." },
    { name: "Facial Treatment", price: 1500, description: "Rejuvenate your skin and glow." },
    { name: "Hair Coloring", price: 2500, description: "Change your hair color with style." },
    { name: "Makeup", price: 2000, description: "Professional makeup for any occasion." },
    { name: "Massage Therapy", price: 1800, description: "Relax and relieve tension." },
];

// Container
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
        <ul class="user-bookings"></ul>
    `;

    // Attach book event
    const btn = card.querySelector(".book-btn");
    btn.addEventListener("click", async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to book.");
            window.location.href = "login.html";
            return;
        }

        // Prompt date and time
        const date = prompt("Enter booking date (YYYY-MM-DD):");
        if (!date) return alert("Date is required.");

        const time = prompt("Enter time (e.g., 10:00 AM):");
        if (!time) return alert("Time is required.");

        // Call booking function
        await book(s.name, s.price, date, time);

        // Reload user bookings under this service
        const ul = card.querySelector(".user-bookings");
        ul.innerHTML = "";
        loadUserBookingsList(ul, s.name);
    });

    container.appendChild(card);
});

// Load user bookings for a specific service
async function loadUserBookingsList(ul, serviceName) {
    const user = auth.currentUser;
    if (!user) return;

    const bookings = document.getElementById("services-container"); // reused element
    // call loadUserBookings but filter by service
    import("./booking.js").then(module => {
        module.loadUserBookings("bookingList").then(() => {
            const querySnap = module.db ? module.db : []; // safety fallback
        });
    });
}

// On auth state change, load user bookings under each service
auth.onAuthStateChanged(user => {
    if (!user) return;
    const cards = document.querySelectorAll(".service-card");
    cards.forEach(card => {
        const ul = card.querySelector(".user-bookings");
        const serviceName = card.querySelector("h3").textContent;
        loadUserBookingsForService(ul, serviceName);
    });
});

// Helper: load bookings for a specific service
async function loadUserBookingsForService(ul, serviceName) {
    ul.innerHTML = "";
    const { auth, db } = await import("./firebase.js");
    const { collection, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js");

    const user = auth.currentUser;
    if (!user) return;

    const q = query(
        collection(db, "bookings"),
        where("uid", "==", user.uid),
        where("service", "==", serviceName)
    );

    const snap = await getDocs(q);
    if (snap.empty) {
        ul.innerHTML = "<li>No bookings yet for this service.</li>";
        return;
    }

    snap.forEach(d => {
        const b = d.data();
        const li = document.createElement("li");
        li.innerHTML = `${b.date} • ${b.time} — Status: <b>${b.status}</b>`;
        ul.appendChild(li);
    });
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// BOOK FUNCTION
window.book = async function(service, price) {
    await addDoc(collection(db, "bookings"), {
        service,
        price,
        date: new Date().toLocaleString()
    });

    alert("Booked successfully!");
    loadBookings();
};

// Load bookings
async function loadBookings() {
    const list = document.getElementById("bookingList");
    list.innerHTML = "";

    const querySnap = await getDocs(collection(db, "bookings"));

    querySnap.forEach(doc => {
        const data = doc.data();
        let li = document.createElement("li");
        li.textContent = `${data.service} - KSh ${data.price} - ${data.date}`;
        list.appendChild(li);
    });
}

loadBookings();

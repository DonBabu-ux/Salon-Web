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

// Create service cards
services.forEach(service => {
    const card = document.createElement("div");
    card.className = "service-card glass";

    card.innerHTML = `
        <h3>${service.name}</h3>
        <p class="desc">${service.description}</p>
        <p class="price">KSh ${service.price}</p>
        <button onclick="bookService('${service.name}', ${service.price})" class="btn book-btn">Book Now</button>
    `;

    container.appendChild(card);
});

// Booking function
function bookService(name, price) {
    if(typeof book === "function") {
        book(name, price); // Calls your Firestore booking function
    } else {
        alert(`Booked ${name} for KSh ${price}`);
    }
}

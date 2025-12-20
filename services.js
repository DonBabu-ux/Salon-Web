// ✅ List of services with images
// Add unlimited number of services here

const services = [
    {
        name: "Hair Styling",
        img: "images/hair1.jpg",
        desc: "Professional and modern hair styling."
    },
    {
        name: "Braiding",
        img: "images/braid1.jpg",
        desc: "Neat and long-lasting beautiful braids."
    },
    {
        name: "Makeup",
        img: "images/makeup1.jpg",
        desc: "Flawless makeup for all occasions."
    },
    {
        name: "Nail Art",
        img: "images/nails1.jpg",
        desc: "Unique designs and gel polish."
    },
    {
        name: "Facial Treatment",
        img: "images/facial1.jpg",
        desc: "Deep-cleansing facials for glowing skin."
    },

    // ✅ Add more services like this:
    // {
    //     name: "Service Name",
    //     img: "images/yourImage.jpg",
    //     desc: "Short description here."
    // },
];

// ✅ Render services into HTML
const container = document.getElementById("services-container");

services.forEach(service => {
    container.innerHTML += `
        <div class="service-card glass">
            <img src="${service.img}" alt="${service.name}">
            <h3>${service.name}</h3>
            <p>${service.desc}</p>
            <button class="btn">Book Now</button>
        </div>
    `;
});

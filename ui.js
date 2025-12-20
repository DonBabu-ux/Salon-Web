// ui.js
document.addEventListener("DOMContentLoaded", () => {
  // apply saved theme
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved === "dark") root.classList.add("dark");

  // header scroll behavior
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 16) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    });
  }

  // dark toggle button
  const toggle = document.querySelector(".toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      root.classList.toggle("dark");
      localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
    });
  }

  // reveal fade-up elements
  const reveal = () => {
    document.querySelectorAll(".fade-up").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 40) el.classList.add("show");
    });
  };
  reveal();
  window.addEventListener("scroll", reveal);
  window.addEventListener("resize", reveal);
});

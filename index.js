
const menu = document.getElementById("menuOffcanvas");
const overlay = document.getElementById("overlay");
const btnAbrir = document.getElementById("btnAbrir");
const btnCerrar = document.getElementById("btnCerrar");

btnAbrir.addEventListener("click", () => {
  menu.classList.remove("translate-x-full");
  overlay.classList.remove("opacity-0", "pointer-events-none");
});

btnCerrar.addEventListener("click", () => {
  menu.classList.add("translate-x-full");
  overlay.classList.add("opacity-0", "pointer-events-none");
});

overlay.addEventListener("click", () => {
  menu.classList.add("translate-x-full");
  overlay.classList.add("opacity-0", "pointer-events-none");
});


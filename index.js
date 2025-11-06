
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
const drawer = document.getElementById("drawer");
const drawerPanel = document.getElementById("drawerPanel");
const closeDrawer = document.getElementById("closeDrawer");
const continueShopping = document.getElementById("continueShopping");

document.querySelector('[data-commandfor="drawer"]').addEventListener("click", () => {
  drawer.classList.remove("hidden");
  setTimeout(() => {
    drawerPanel.classList.remove("translate-x-full");
  }, 10);
});

function closeCart() {
  drawerPanel.classList.add("translate-x-full");
  setTimeout(() => drawer.classList.add("hidden"), 300);
}

closeDrawer.addEventListener("click", closeCart);
continueShopping.addEventListener("click", closeCart);
drawer.addEventListener("click", e => {
  if (e.target === drawer) closeCart();
});



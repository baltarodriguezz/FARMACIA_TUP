document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS ---
  const perfilBtn = document.querySelector("#perfilBtn");
  const menuNoSesion = document.querySelector("#userMenuNoSesion");
  const menuSesion = document.querySelector("#userMenuSesion");

  const inicioSesionLink = document.querySelector("#inicio_sesion");
  const loginModal = document.querySelector("#loginModal");
  const closeLoginModal = document.querySelector("#closeLoginModal");

  const menuOffcanvas = document.querySelector("#menuOffcanvas");
  const btnAbrir = document.querySelector("#btnAbrir");
  const btnCerrar = document.querySelector("#btnCerrar");

  // 🛒 Carrito
  const cartBtn = document.querySelector("#cartBtn");
  const cartPanel = document.querySelector("#cartPanel");
  const cartOverlay = document.querySelector("#cartOverlay");
  const cartCloseBtn = document.querySelector("#cartCloseBtn");

  // ✳️ Simulación de login (cambiar cuando conectes backend)
  let usuarioLogueado = true;

  // ============================
  //   MENÚ USUARIO (ANIMACIÓN VERTICAL)
  // ============================

  function cerrarConAnimacion(menu) {
    if (!menu || menu.classList.contains("hidden")) return;

    menu.classList.remove("translate-y-0", "opacity-100");
    menu.classList.add("-translate-y-5", "opacity-0");

    setTimeout(() => {
      menu.classList.add("hidden");
    }, 300);
  }

  function cerrarMenusUsuario() {
    cerrarConAnimacion(menuNoSesion);
    cerrarConAnimacion(menuSesion);
  }

  function abrirConAnimacion(menu) {
    if (!menu) return;

    menu.classList.remove("hidden");
    menu.classList.add("-translate-y-5", "opacity-0");

    // forzar reflow
    menu.offsetHeight;

    menu.classList.remove("-translate-y-5", "opacity-0");
    menu.classList.add("translate-y-0", "opacity-100");
  }

  function toggleMenuUsuario() {
    const menuMostrar = usuarioLogueado ? menuSesion : menuNoSesion;
    const menuOcultar = usuarioLogueado ? menuNoSesion : menuSesion;

    if (!menuMostrar) return;

    // si ya está visible → lo cierro
    if (!menuMostrar.classList.contains("hidden")) {
      cerrarConAnimacion(menuMostrar);
      return;
    }

    cerrarConAnimacion(menuOcultar);
    abrirConAnimacion(menuMostrar);
  }

  // Click en icono usuario
  perfilBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenuUsuario();
  });

  // Cerrar menú usuario clic fuera
  document.addEventListener("click", (e) => {
    const clicDentroMenu =
      (menuNoSesion && menuNoSesion.contains(e.target)) ||
      (menuSesion && menuSesion.contains(e.target)) ||
      (perfilBtn && perfilBtn.contains(e.target));

    if (!clicDentroMenu) {
      cerrarMenusUsuario();
    }
  });

  // ============================
  //          LOGIN MODAL
  // ============================

  function abrirLoginModal() {
    if (!loginModal) return;
    loginModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  function cerrarLoginModal() {
    if (!loginModal) return;
    loginModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  inicioSesionLink?.addEventListener("click", (e) => {
    e.preventDefault();
    cerrarMenusUsuario();
    abrirLoginModal();
  });

  closeLoginModal?.addEventListener("click", () => {
    cerrarLoginModal();
  });

  loginModal?.addEventListener("click", (e) => {
    if (e.target === loginModal) cerrarLoginModal();
  });

  // ============================
  //      OFFCANVAS MÓVIL
  // ============================

  function abrirOffcanvas() {
    if (!menuOffcanvas) return;
    menuOffcanvas.classList.remove("translate-x-full");
  }

  function cerrarOffcanvas() {
    if (!menuOffcanvas) return;
    menuOffcanvas.classList.add("translate-x-full");
  }

  btnAbrir?.addEventListener("click", () => abrirOffcanvas());
  btnCerrar?.addEventListener("click", () => cerrarOffcanvas());

  document.addEventListener("click", (e) => {
    if (!menuOffcanvas) return;

    const clicDentroOffcanvas =
      menuOffcanvas.contains(e.target) ||
      (btnAbrir && btnAbrir.contains(e.target));

    if (!clicDentroOffcanvas) {
      cerrarOffcanvas();
    }
  });

  // ============================
  //      CARRITO LATERAL
  // ============================

  function abrirCarrito() {
    if (!cartPanel) return;
    cartPanel.classList.remove("translate-x-full");
    cartOverlay?.classList.remove("hidden");
  }

  function cerrarCarrito() {
    if (!cartPanel) return;
    cartPanel.classList.add("translate-x-full");
    cartOverlay?.classList.add("hidden");
  }

  cartBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    abrirCarrito();
  });

  cartCloseBtn?.addEventListener("click", () => {
    cerrarCarrito();
  });

  cartOverlay?.addEventListener("click", () => {
    cerrarCarrito();
  });

  // ============================
  //   ESC → CERRAR TODO
  // ============================

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarLoginModal();
      cerrarMenusUsuario();
      cerrarOffcanvas();
      cerrarCarrito();
    }
  });

  // ============================
  //   CERRAR SESIÓN (VISUAL)
  // ============================

  const cerrarSesion = document.querySelector("#cerrarSesion");
  cerrarSesion?.addEventListener("click", (e) => {
    e.preventDefault();
    usuarioLogueado = false;
    cerrarMenusUsuario();
  });

  // Simulación de login correcto desde el modal
  loginModal?.querySelector("form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    usuarioLogueado = true;
    cerrarLoginModal();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const perfilBtn = document.querySelector("#perfilBtn");
  const menuNoSesion = document.querySelector("#userMenuNoSesion");
  const menuSesion = document.querySelector("#userMenuSesion");

  const inicioSesionLink = document.querySelector("#inicio_sesion");
  const loginModal = document.querySelector("#loginModal");
  const closeLoginModal = document.querySelector("#closeLoginModal");

  const menuOffcanvas = document.querySelector("#menuOffcanvas");
  const btnAbrir = document.querySelector("#btnAbrir");
  const btnCerrar = document.querySelector("#btnCerrar");

  let usuarioLogueado = true;

  // === ANIMACIÓN VERTICAL ===

  function cerrarConAnimacion(menu) {
    if (!menu || menu.classList.contains("hidden")) return;

    menu.classList.remove("translate-y-0", "opacity-100");
    menu.classList.add("-translate-y-5", "opacity-0");

    setTimeout(() => {
      menu.classList.add("hidden");
    }, 300);
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

    if (!menuMostrar.classList.contains("hidden")) {
      cerrarConAnimacion(menuMostrar);
      return;
    }

    cerrarConAnimacion(menuOcultar);
    abrirConAnimacion(menuMostrar);
  }

  perfilBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenuUsuario();
  });

  document.addEventListener("click", (e) => {
    const clicDentroMenu =
      menuNoSesion.contains(e.target) ||
      menuSesion.contains(e.target) ||
      perfilBtn.contains(e.target);

    if (!clicDentroMenu) cerrarMenusUsuario();
  });

  function cerrarMenusUsuario() {
    cerrarConAnimacion(menuNoSesion);
    cerrarConAnimacion(menuSesion);
  }

  // === LOGIN ===

  function abrirLoginModal() {
    loginModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  function cerrarLoginModal() {
    loginModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  inicioSesionLink?.addEventListener("click", (e) => {
    e.preventDefault();
    cerrarMenusUsuario();
    abrirLoginModal();
  });

  closeLoginModal?.addEventListener("click", cerrarLoginModal);

  loginModal?.addEventListener("click", (e) => {
    if (e.target === loginModal) cerrarLoginModal();
  });

  // === OFFCANVAS ===

  function abrirOffcanvas() {
    menuOffcanvas.classList.remove("translate-x-full");
  }

  function cerrarOffcanvas() {
    menuOffcanvas.classList.add("translate-x-full");
  }

  btnAbrir?.addEventListener("click", abrirOffcanvas);
  btnCerrar?.addEventListener("click", cerrarOffcanvas);

  document.addEventListener("click", (e) => {
    const clicDentro =
      menuOffcanvas.contains(e.target) ||
      btnAbrir.contains(e.target);
    if (!clicDentro) cerrarOffcanvas();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarLoginModal();
      cerrarMenusUsuario();
      cerrarOffcanvas();
    }
  });

  const cerrarSesion = document.querySelector("#cerrarSesion");
  cerrarSesion?.addEventListener("click", () => {
    usuarioLogueado = false;
    cerrarMenusUsuario();
  });

  loginModal?.querySelector("form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    usuarioLogueado = true;
    cerrarLoginModal();
  });
});

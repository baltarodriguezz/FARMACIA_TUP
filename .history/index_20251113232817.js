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

  // ✳️ Simulación de login (cambiar cuando conectes backend)
  let usuarioLogueado = true; // o false, según lo que quieras probar

  // ============================
  //   MENÚ USUARIO (ANIMACIÓN VERTICAL)
  // ============================

  function cerrarConAnimacion(menu) {
    if (!menu || menu.classList.contains("hidden")) return;

    // de posición normal → subir un poco y desvanecer
    menu.classList.remove("translate-y-0", "opacity-100");
    menu.classList.add("-translate-y-2", "opacity-0");

    setTimeout(() => {
      menu.classList.add("hidden");
    }, 200); // mismo que duration-200
  }

  function cerrarMenusUsuario() {
    cerrarConAnimacion(menuNoSesion);
    cerrarConAnimacion(menuSesion);
  }

  function abrirConAnimacion(menu) {
    if (!menu) return;

    // mostrar en estado inicial: un poco más arriba y transparente
    menu.classList.remove("hidden");
    menu.classList.add("-translate-y-2", "opacity-0");

    // forzar reflow para que el navegador aplique este estado
    // antes de empezar la transición
    // eslint-disable-next-line no-unused-expressions
    menu.offsetHeight;

    // ahora animar hacia abajo + opaco
    menu.classList.remove("-translate-y-2", "opacity-0");
    menu.classList.add("translate-y-0", "opacity-100");
  }

  function toggleMenuUsuario() {
    const menuMostrar = usuarioLogueado ? menuSesion : menuNoSesion;
    const menuOcultar = usuarioLogueado ? menuNoSesion : menuSesion;

    if (!menuMostrar) return;

    // Si el menú ya está visible → cerrarlo (toggle real)
    if (!menuMostrar.classList.contains("hidden")) {
      cerrarConAnimacion(menuMostrar);
      return;
    }

    // Cerrar el otro, si está abierto
    cerrarConAnimacion(menuOcultar);

    // Abrir este con animación
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

  // Cerrar offcanvas clic fuera
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
  //   ESC → CERRAR TODO
  // ============================

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarLoginModal();
      cerrarMenusUsuario();
      cerrarOffcanvas();
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

  // Simular login al enviar el form del modal
  loginModal?.querySelector("form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    usuarioLogueado = true;
    cerrarLoginModal();
  });
});

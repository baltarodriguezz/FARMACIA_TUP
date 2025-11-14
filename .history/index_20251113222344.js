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
  let usuarioLogueado = false;

  // ============================
  //   MENÚ USUARIO (CON ANIMACIÓN)
  // ============================

  function cerrarMenusUsuario() {
    [menuNoSesion, menuSesion].forEach((menu) => {
      if (!menu || menu.classList.contains("hidden")) return;

      // Animar salida → derecha + fade
      menu.classList.remove("translate-x-0", "opacity-100");
      menu.classList.add("translate-x-4", "opacity-0");

      // Luego de la animación, ocultar
      setTimeout(() => {
        menu.classList.add("hidden");
      }, 200); // coincide con duration-200 de Tailwind
    });
  }

  function toggleMenuUsuario() {
    const menuMostrar = usuarioLogueado ? menuSesion : menuNoSesion;
    const menuOcultar = usuarioLogueado ? menuNoSesion : menuSesion;

    // Cerrar el otro menú si está abierto
    if (menuOcultar && !menuOcultar.classList.contains("hidden")) {
      menuOcultar.classList.remove("translate-x-0", "opacity-100");
      menuOcultar.classList.add("translate-x-4", "opacity-0");
      setTimeout(() => {
        menuOcultar.classList.add("hidden");
      }, 200);
    }

    if (!menuMostrar) return;

    // Estado inicial (un poco a la derecha y transparente)
    menuMostrar.classList.remove("hidden");
    menuMostrar.classList.add("translate-x-4", "opacity-0");

    // Siguiente frame → entrar suave
    requestAnimationFrame(() => {
      menuMostrar.classList.remove("translate-x-4", "opacity-0");
      menuMostrar.classList.add("translate-x-0", "opacity-100");
    });
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

  // Si luego querés simular login real:
  // loginModal?.querySelector("form")?.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   usuarioLogueado = true;
  //   cerrarLoginModal();
  // });
});

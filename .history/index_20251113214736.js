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

  // ✳️ Simulación de login (cámbialo cuando conectes backend)
  let usuarioLogueado = false;

  // --- MENÚ USUARIO ---

  function cerrarMenusUsuario() {
    menuNoSesion.classList.add("hidden");
    menuSesion.classList.add("hidden");
  }

  function toggleMenuUsuario() {
    const menuMostrar = usuarioLogueado ? menuSesion : menuNoSesion;
    const menuOcultar = usuarioLogueado ? menuNoSesion : menuSesion;

    menuOcultar.classList.add("hidden");
    menuMostrar.classList.toggle("hidden");
  }

  // Click en icono usuario
  perfilBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenuUsuario();
  });

  // Cerrar menú usuario clic fuera
  document.addEventListener("click", (e) => {
    const clicDentroMenu =
      menuNoSesion.contains(e.target) ||
      menuSesion.contains(e.target) ||
      (perfilBtn && perfilBtn.contains(e.target));

    if (!clicDentroMenu) {
      cerrarMenusUsuario();
    }
  });

  // --- LOGIN MODAL ---

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

  closeLoginModal?.addEventListener("click", () => {
    cerrarLoginModal();
  });

  loginModal?.addEventListener("click", (e) => {
    if (e.target === loginModal) cerrarLoginModal();
  });

  // Esc → cerrar todo
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarLoginModal();
      cerrarMenusUsuario();
      cerrarOffcanvas();
    }
  });

  // --- OFFCANVAS MÓVIL ---

  function abrirOffcanvas() {
    menuOffcanvas.classList.remove("translate-x-full");
  }

  function cerrarOffcanvas() {
    menuOffcanvas.classList.add("translate-x-full");
  }

  btnAbrir?.addEventListener("click", () => abrirOffcanvas());
  btnCerrar?.addEventListener("click", () => cerrarOffcanvas());

  document.addEventListener("click", (e) => {
    const clicDentroOffcanvas =
      menuOffcanvas.contains(e.target) ||
      (btnAbrir && btnAbrir.contains(e.target));

    if (!clicDentroOffcanvas) {
      cerrarOffcanvas();
    }
  });

  // Cerrar sesión (solo visual)
  const cerrarSesion = document.querySelector("#cerrarSesion");
  cerrarSesion?.addEventListener("click", (e) => {
    e.preventDefault();
    usuarioLogueado = false;
    cerrarMenusUsuario();
  });

  // Si luego querés cambiar a "logueado = true" al enviar el form de login:
  // loginModal.querySelector("form")?.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   usuarioLogueado = true;
  //   cerrarLoginModal();
  // });
});

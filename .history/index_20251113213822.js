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

  // ✳️ Simulación de estado de login (cámbialo a true si querés ver el menú de sesión iniciada)
  let usuarioLogueado = false;

  // --- FUNCIONES MENÚ USUARIO ---

  function cerrarMenusUsuario() {
    menuNoSesion.classList.add("hidden", "translate-x-full");
    menuSesion.classList.add("hidden", "translate-x-full");
  }

  function toggleMenuUsuario() {
    const menuMostrar = usuarioLogueado ? menuSesion : menuNoSesion;
    const menuOcultar = usuarioLogueado ? menuNoSesion : menuSesion;

    // Aseguramos que el otro menú esté cerrado
    menuOcultar.classList.add("hidden", "translate-x-full");

    // Toggle del menú correspondiente
    menuMostrar.classList.toggle("hidden");
    menuMostrar.classList.toggle("translate-x-full");
  }

  // --- FUNCIONES LOGIN MODAL ---

  function abrirLoginModal() {
    loginModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  function cerrarLoginModal() {
    loginModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  // --- FUNCIONES MENÚ OFFCANVAS MÓVIL ---

  function abrirOffcanvas() {
    menuOffcanvas.classList.remove("translate-x-full");
  }

  function cerrarOffcanvas() {
    menuOffcanvas.classList.add("translate-x-full");
  }

  // --- EVENTOS ---

  // Click en icono usuario
  perfilBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenuUsuario();
  });

  // Click en "Iniciar sesión" → abrir modal
  inicioSesionLink?.addEventListener("click", (e) => {
    e.preventDefault();
    cerrarMenusUsuario();
    abrirLoginModal();
  });

  // Cerrar modal (botón ✕)
  closeLoginModal?.addEventListener("click", () => {
    cerrarLoginModal();
  });

  // Cerrar modal haciendo clic fuera del contenido
  loginModal?.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      cerrarLoginModal();
    }
  });

  // Esc → cerrar modal y menús usuario
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarLoginModal();
      cerrarMenusUsuario();
      cerrarOffcanvas();
    }
  });

  // Cerrar menús usuario haciendo click fuera
  document.addEventListener("click", (e) => {
    const clicDentroMenu = 
      menuNoSesion.contains(e.target) ||
      menuSesion.contains(e.target) ||
      (perfilBtn && perfilBtn.contains(e.target));

    if (!clicDentroMenu) {
      cerrarMenusUsuario();
    }
  });

  // Offcanvas móvil
  btnAbrir?.addEventListener("click", () => {
    abrirOffcanvas();
  });

  btnCerrar?.addEventListener("click", () => {
    cerrarOffcanvas();
  });

  // Cerrar offcanvas clic fuera (solo en móvil, opcional)
  document.addEventListener("click", (e) => {
    const clicDentroOffcanvas =
      menuOffcanvas.contains(e.target) ||
      (btnAbrir && btnAbrir.contains(e.target));

    if (!clicDentroOffcanvas) {
      cerrarOffcanvas();
    }
  });

  // Ejemplo de cierre de sesión (solo UI)
  const cerrarSesion = document.querySelector("#cerrarSesion");
  cerrarSesion?.addEventListener("click", (e) => {
    e.preventDefault();
    usuarioLogueado = false;
    cerrarMenusUsuario();
    // acá podrías limpiar tokens, localStorage, etc.
  });

  // Si quisieras simular login correcto desde el formulario:
  // loginModal.querySelector("form")?.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   usuarioLogueado = true;
  //   cerrarLoginModal();
  // });
});

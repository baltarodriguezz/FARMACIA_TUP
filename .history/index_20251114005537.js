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

  // 🔐 Login form
  const loginForm = document.querySelector("#loginForm");
  const loginEmail = document.querySelector("#loginEmail");
  const loginPassword = document.querySelector("#loginPassword");

  // ✳️ Estado de sesión (por defecto NO logueado)
  let usuarioLogueado = false;

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
    // eslint-disable-next-line no-unused-expressions
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

    if (!clicDentroOffcanvas) cerrarOffcanvas();
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
  //   LOGIN REAL CON JWT
  // ============================

  // 👉 Cambiá esta URL si tu API corre en otro puerto / dominio
  const LOGIN_URL = "https://localhost:7196/api/Login/login";

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginEmail?.value.trim();
    const password = loginPassword?.value.trim();

    if (!email || !password) {
      alert("Completá email y contraseña.");
      return;
    }

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText || "Email o contraseña incorrectos.");
        return;
      }

      const data = await response.json();
      const token = data.token;

      if (!token) {
        alert("No se recibió el token del servidor.");
        return;
      }

      // Guarda el token para futuras peticiones
      localStorage.setItem("jwtToken", token);

      // Marca al usuario como logueado
      usuarioLogueado = true;

      // Cierra el modal
      cerrarLoginModal();

      // Opcional: mostrar un mensajito rápido
      console.log("Login exitoso ✅");

    } catch (error) {
      console.error("Error en el login:", error);
      alert("No se pudo conectar con el servidor. Intentalo de nuevo.");
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
    localStorage.removeItem("jwtToken");
    cerrarMenusUsuario();
  });
});

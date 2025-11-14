// =========================
// CONFIG
// =========================
const API_BASE_URL = "https://localhost:7028"; // puerto donde está tu Swagger


// =========================
// UTILIDADES
// =========================
function getInitialsFromName(name) {
  if (!name) return "U";
  return name.trim().charAt(0).toUpperCase();
}

function getNameFromEmail(email) {
  if (!email) return "";
  return email.split("@")[0];
}

// =========================
// ESTADO GLOBAL SIMPLE
// =========================
let isLoggedIn = false;
let currentOpenUserMenu = null;

// =========================
// ESPERAR A QUE CARGUE EL DOM
// =========================
document.addEventListener("DOMContentLoaded", () => {
  // ----- Referencias a elementos -----
  const perfilBtn       = document.getElementById("perfilBtn");
  const userMenuNoSesion = document.getElementById("userMenuNoSesion");
  const userMenuSesion   = document.getElementById("userMenuSesion");
  const inicioSesionBtn  = document.getElementById("inicio_sesion");

  const loginModal       = document.getElementById("loginModal");
  const closeLoginModal  = document.getElementById("closeLoginModal");
  const loginForm        = document.getElementById("loginForm");
  const loginEmailInput  = document.getElementById("loginEmail");
  const loginPassInput   = document.getElementById("loginPassword");
  const loginError       = document.getElementById("loginError");

  const nombreUsuarioSpan = document.getElementById("nombreUsuario");
  const cerrarSesionBtn   = document.getElementById("cerrarSesion");

  // Menú offcanvas móvil
  const menuOffcanvas = document.getElementById("menuOffcanvas");
  const btnAbrir      = document.getElementById("btnAbrir");
  const btnCerrar     = document.getElementById("btnCerrar");

  // Carrito
  const cartBtn       = document.getElementById("cartBtn");
  const cartOverlay   = document.getElementById("cartOverlay");
  const cartPanel     = document.getElementById("cartPanel");
  const cartCloseBtn  = document.getElementById("cartCloseBtn");

  // =========================
  // 1) CARGAR ESTADO DE LOGIN DESDE LOCALSTORAGE
  // =========================
  const storedToken = localStorage.getItem("authToken");
  const storedName  = localStorage.getItem("userName");

  if (storedToken) {
    isLoggedIn = true;
    if (storedName && nombreUsuarioSpan) {
      nombreUsuarioSpan.textContent = storedName;
    }
    actualizarAvatar(storedName);
  } else {
    isLoggedIn = false;
  }

  // =========================
  // 2) MANEJO DE MENÚ USUARIO
  // =========================

  function abrirMenu(menuElement) {
    if (!menuElement) return;

    menuElement.classList.remove("hidden");
    // animación simple
    requestAnimationFrame(() => {
      menuElement.classList.remove("translate-x-4", "opacity-0");
    });
    currentOpenUserMenu = menuElement;
  }

  function cerrarMenu(menuElement) {
    if (!menuElement) return;

    menuElement.classList.add("translate-x-4", "opacity-0");
    setTimeout(() => {
      menuElement.classList.add("hidden");
      if (currentOpenUserMenu === menuElement) {
        currentOpenUserMenu = null;
      }
    }, 150);
  }

  function toggleUserMenu() {
    const menuActual = isLoggedIn ? userMenuSesion : userMenuNoSesion;

    // si ese mismo menú está abierto, se cierra
    if (currentOpenUserMenu === menuActual) {
      cerrarMenu(menuActual);
    } else {
      // cerramos el que esté abierto
      if (currentOpenUserMenu) cerrarMenu(currentOpenUserMenu);
      // abrimos el correspondiente
      abrirMenu(menuActual);
    }
  }

  if (perfilBtn) {
    perfilBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleUserMenu();
    });
  }

  // cerrar menús al hacer click fuera
  document.addEventListener("click", (e) => {
    if (
      currentOpenUserMenu &&
      !currentOpenUserMenu.contains(e.target) &&
      e.target !== perfilBtn
    ) {
      cerrarMenu(currentOpenUserMenu);
    }
  });

  // =========================
  // 3) MODAL LOGIN
  // =========================
  function abrirLoginModal() {
    if (!loginModal) return;
    loginModal.classList.remove("hidden");
  }

  function cerrarLoginModal() {
    if (!loginModal) return;
    loginModal.classList.add("hidden");
    if (loginError) {
      loginError.classList.add("hidden");
      loginError.textContent = "";
    }
    if (loginPassInput) loginPassInput.value = "";
  }

  if (inicioSesionBtn) {
    inicioSesionBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      cerrarMenu(userMenuNoSesion);
      abrirLoginModal();
    });
  }

  if (closeLoginModal) {
    closeLoginModal.addEventListener("click", cerrarLoginModal);
  }

  // cerrar modal haciendo click en el fondo oscuro
  if (loginModal) {
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) {
        cerrarLoginModal();
      }
    });
  }

  // =========================
  // 4) SUBMIT LOGIN (FETCH A LA API)
// =========================
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = loginEmailInput.value.trim();
      const password = loginPassInput.value;

      if (!email || !password) return;

      if (loginError) {
        loginError.classList.add("hidden");
        loginError.textContent = "";
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/Login/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });

        if (!response.ok) {
          // Ejemplo: 400, 401, etc.
          const errorData = await response.json().catch(() => ({}));
          console.error("Error login:", errorData);

          if (loginError) {
            loginError.textContent = errorData?.error || "Credenciales incorrectas";
            loginError.classList.remove("hidden");
          }
          return;
        }

        const data = await response.json();
        const token = data.token;

        if (!token) {
          if (loginError) {
            loginError.textContent = "La respuesta no contiene token";
            loginError.classList.remove("hidden");
          }
          return;
        }

        // Guardamos token y nombre "provisorio" basado en email
        const nameFromEmail = getNameFromEmail(email);

        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", nameFromEmail);

        isLoggedIn = true;

        if (nombreUsuarioSpan) {
          nombreUsuarioSpan.textContent = nameFromEmail;
        }
        actualizarAvatar(nameFromEmail);

        cerrarLoginModal();

        // Cerramos menú sin sesión por si quedó abierto y abrimos el otro
        cerrarMenu(userMenuNoSesion);
        // opcional: mostrar un toque el menú logueado
        abrirMenu(userMenuSesion);

      } catch (error) {
        console.error("Error de red:", error);
        if (loginError) {
          loginError.textContent = "No se pudo conectar con el servidor";
          loginError.classList.remove("hidden");
        }
      }
    });
  }

  // Actualizar la inicial del avatar (por ahora está fija en "B" en el HTML)
  function actualizarAvatar(name) {
    const avatarDiv = userMenuSesion?.querySelector("div.w-9.h-9 span");
    if (avatarDiv) {
      avatarDiv.textContent = getInitialsFromName(name || nombreUsuarioSpan?.textContent);
    }
  }

  // =========================
  // 5) CERRAR SESIÓN
  // =========================
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      isLoggedIn = false;

      cerrarMenu(userMenuSesion);
      // opcional: refrescar
      // location.reload();

      // Si querés que quede limpio sin recargar:
      if (nombreUsuarioSpan) nombreUsuarioSpan.textContent = "Usuario";
      actualizarAvatar("U");
    });
  }

  // =========================
  // 6) MENÚ OFFCANVAS (MÓVIL)
// =========================
  function abrirOffcanvas() {
    if (!menuOffcanvas) return;
    menuOffcanvas.classList.remove("translate-x-full");
  }

  function cerrarOffcanvas() {
    if (!menuOffcanvas) return;
    menuOffcanvas.classList.add("translate-x-full");
  }

  if (btnAbrir) {
    btnAbrir.addEventListener("click", abrirOffcanvas);
  }

  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarOffcanvas);
  }

  // cerrar offcanvas si se hace swipe o click fuera (opcional, simple: click en body)
  document.addEventListener("click", (e) => {
    if (
      menuOffcanvas &&
      !menuOffcanvas.contains(e.target) &&
      e.target !== btnAbrir &&
      !menuOffcanvas.classList.contains("translate-x-full")
    ) {
      // no cierro acá porque ya tengo otras cosas usando click global
      // si querés esto, descomentalo:
      // cerrarOffcanvas();
    }
  });

  // =========================
  // 7) CARRITO LATERAL
  // =========================
  function abrirCarrito() {
    if (!cartPanel || !cartOverlay) return;
    cartPanel.classList.remove("translate-x-full");
    cartOverlay.classList.remove("hidden");
  }

  function cerrarCarrito() {
    if (!cartPanel || !cartOverlay) return;
    cartPanel.classList.add("translate-x-full");
    cartOverlay.classList.add("hidden");
  }

  if (cartBtn) {
    cartBtn.addEventListener("click", abrirCarrito);
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener("click", cerrarCarrito);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", cerrarCarrito);
  }
});

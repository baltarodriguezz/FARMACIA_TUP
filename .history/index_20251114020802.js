const API_BASE_URL = "https://localhost:7028"; 


function getInitialsFromName(name) {
  if (!name) return "U";
  return name.trim().charAt(0).toUpperCase();
}

function getNameFromEmail(email) {
  if (!email) return "";
  return email.split("@")[0];
}


let isLoggedIn = false;
let currentOpenUserMenu = null;


document.addEventListener("DOMContentLoaded", () => {

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

  const menuOffcanvas = document.getElementById("menuOffcanvas");
  const btnAbrir      = document.getElementById("btnAbrir");
  const btnCerrar     = document.getElementById("btnCerrar");

  const cartBtn       = document.getElementById("cartBtn");
  const cartOverlay   = document.getElementById("cartOverlay");
  const cartPanel     = document.getElementById("cartPanel");
  const cartCloseBtn  = document.getElementById("cartCloseBtn");


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

  function abrirMenu(menuElement) {
    if (!menuElement) return;

    menuElement.classList.remove("hidden");

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

    if (currentOpenUserMenu === menuActual) {
      cerrarMenu(menuActual);
    } else {

      if (currentOpenUserMenu) cerrarMenu(currentOpenUserMenu);

      abrirMenu(menuActual);
    }
  }

  if (perfilBtn) {
    perfilBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleUserMenu();
    });
  }

  document.addEventListener("click", (e) => {
    if (
      currentOpenUserMenu &&
      !currentOpenUserMenu.contains(e.target) &&
      e.target !== perfilBtn
    ) {
      cerrarMenu(currentOpenUserMenu);
    }
  });


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

  if (loginModal) {
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) {
        cerrarLoginModal();
      }
    });
  }


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


        const nameFromEmail = getNameFromEmail(email);

        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", nameFromEmail);

        isLoggedIn = true;

        if (nombreUsuarioSpan) {
          nombreUsuarioSpan.textContent = nameFromEmail;
        }
        actualizarAvatar(nameFromEmail);

        cerrarLoginModal();

        cerrarMenu(userMenuNoSesion);
  
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


  function actualizarAvatar(name) {
    const avatarDiv = userMenuSesion?.querySelector("div.w-9.h-9 span");
    if (avatarDiv) {
      avatarDiv.textContent = getInitialsFromName(name || nombreUsuarioSpan?.textContent);
    }
  }


  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      isLoggedIn = false;

      cerrarMenu(userMenuSesion);

      if (nombreUsuarioSpan) nombreUsuarioSpan.textContent = "Usuario";
      actualizarAvatar("U");
    });
  }


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

  document.addEventListener("click", (e) => {
    if (
      menuOffcanvas &&
      !menuOffcanvas.contains(e.target) &&
      e.target !== btnAbrir &&
      !menuOffcanvas.classList.contains("translate-x-full")
    ) {

    }
  });


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

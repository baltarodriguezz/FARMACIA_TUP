const API_BASE_URL = "https://localhost:7028";


function getInitialsFromName(name) {
  if (!name) return "U";
  return name.trim().charAt(0).toUpperCase();
}

function getNameFromEmail(email) {
  if (!email) return "";
  const beforeAt = email.split("@")[0];
  const rawName = beforeAt.split(".")[0];
  if (!rawName) return "";
  return rawName.charAt(0).toUpperCase() + rawName.slice(1);
}

let isLoggedIn = false;
let currentOpenUserMenu = null;

document.addEventListener("DOMContentLoaded", () => {

  const perfilBtn        = document.getElementById("perfilBtn");
  const userMenuNoSesion = document.getElementById("userMenuNoSesion");
  const userMenuSesion   = document.getElementById("userMenuSesion");
  const inicioSesionBtn  = document.getElementById("inicio_sesion");

  const loginModal      = document.getElementById("loginModal");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const loginForm       = document.getElementById("loginForm");
  const loginEmailInput = document.getElementById("loginEmail");
  const loginPassInput  = document.getElementById("loginPassword");
  const loginError      = document.getElementById("loginError");

  const nombreUsuarioSpan = document.getElementById("nombreUsuario");
  const cerrarSesionBtn   = document.getElementById("cerrarSesion");


  const menuOffcanvas = document.getElementById("menuOffcanvas");
  const btnAbrir      = document.getElementById("btnAbrir");
  const btnCerrar     = document.getElementById("btnCerrar");

 
  const cartBtn      = document.getElementById("cartBtn");
  const cartOverlay  = document.getElementById("cartOverlay");
  const cartPanel    = document.getElementById("cartPanel");
  const cartCloseBtn = document.getElementById("cartCloseBtn");

const perfilNombreInput   = document.getElementById("nombre");
const perfilApellidoInput = document.getElementById("apellido");
const perfilEmailInput    = document.getElementById("email2");
const perfilPassInput     = document.getElementById("password");
const perfilForm          = document.getElementById("perfilForm");


  

  const storedToken = localStorage.getItem("authToken");

  if (storedToken) {
    isLoggedIn = true;

    fetchCurrentUser();
  } else {
    isLoggedIn = false;
  }


 
  function rellenarFormularioPerfil(cliente) {
    if (perfilNombreInput) {
      perfilNombreInput.value = cliente.nombre ?? "";
    }
    if (perfilApellidoInput) {
      perfilApellidoInput.value = cliente.apellido ?? "";
    }
    if (perfilEmailInput) {
      perfilEmailInput.value = cliente.email ?? "";
    }
    
    if (perfilPassInput) {
      perfilPassInput.value = "";
    }
  }
// =======================
// Guardar cambios en perfil
// =======================

if (perfilForm) {
  perfilForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Tenés que iniciar sesión para actualizar tus datos.");
      return;
    }

    // Armamos el objeto con los datos del formulario
    const payload = {
      nombre:   perfilNombreInput?.value.trim()   ?? "",
      apellido: perfilApellidoInput?.value.trim() ?? "",
      email:    perfilEmailInput?.value.trim()    ?? ""
      // agregá acá otros campos que tenga tu DTO si hace falta
    };

    // Solo mandamos contraseña si el usuario escribió algo
    const nuevaPass = perfilPassInput?.value.trim();
    if (nuevaPass) {
      payload.password = nuevaPass; // ajustá el nombre al que espere tu API
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/Clientes/me`, {
        method: "PUT",                   // o "PATCH" según tu API
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Error al actualizar perfil:", res.status, text);
        alert("No se pudieron guardar los cambios. Revisá los datos.");
        return;
      }

      // Si todo salió bien, podés volver a pedir el usuario
      await fetchCurrentUser();

      alert("Datos actualizados correctamente ✅");

      // limpiamos la contraseña del input
      if (perfilPassInput) perfilPassInput.value = "";
    } catch (err) {
      console.error("Error de red al actualizar perfil:", err);
      alert("Hubo un problema de conexión al guardar los cambios.");
    }
  });
}

  
  async function fetchCurrentUser() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      isLoggedIn = false;
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/Clientes/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (res.status === 401) {
        // Token vencido / inválido
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        isLoggedIn = false;
        return;
      }

      if (!res.ok) {
        console.error("Error al obtener cliente:", res.status);
        return;
      }

      const cliente = await res.json();

      // Nombre para el header
      const nombre =
        cliente.nombre && cliente.nombre.trim().length > 0
          ? cliente.nombre
          : getNameFromEmail(cliente.email);

      localStorage.setItem("userName", nombre);

      if (nombreUsuarioSpan) {
        nombreUsuarioSpan.textContent = nombre;
      }
      actualizarAvatar(nombre);

      // si existe el formulario de perfil, lo completamos
      rellenarFormularioPerfil(cliente);

      // como hay sesión, mostramos el menú de sesión (si existe en esta página)
      if (userMenuSesion && userMenuNoSesion) {
        userMenuSesion.classList.remove("hidden");
        userMenuNoSesion.classList.add("hidden");
      }
    } catch (err) {
      console.error("Error de red al obtener cliente:", err);
    }
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

  function actualizarAvatar(name) {
    const avatarSpan = userMenuSesion?.querySelector("div.w-9.h-9 span");
    if (avatarSpan) {
      avatarSpan.textContent = getInitialsFromName(
        name || nombreUsuarioSpan?.textContent
      );
    }
  }

  // =======================
  // Eventos: menú usuario
  // =======================

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

  // =======================
  // LOGIN
  // =======================

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email    = loginEmailInput.value.trim();
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
          const errorText = await response.text().catch(() => "");
          console.error("Error login:", response.status, errorText);

          if (loginError) {
            loginError.textContent =
              errorText || "Credenciales incorrectas";
            loginError.classList.remove("hidden");
          }
          return;
        }

        const data  = await response.json();
        const token = data.token;

        if (!token) {
          if (loginError) {
            loginError.textContent = "La respuesta no contiene token";
            loginError.classList.remove("hidden");
          }
          return;
        }

        // guardamos token
        localStorage.setItem("authToken", token);
        isLoggedIn = true;

        // pedimos datos reales del cliente
        await fetchCurrentUser();

        cerrarLoginModal();
        if (userMenuNoSesion && userMenuSesion) {
          cerrarMenu(userMenuNoSesion);
          abrirMenu(userMenuSesion);
        }
      } catch (error) {
        console.error("Error de red:", error);
        if (loginError) {
          loginError.textContent = "No se pudo conectar con el servidor";
          loginError.classList.remove("hidden");
        }
      }
    });
  }

  // =======================
  // Cerrar sesión
  // =======================

  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      isLoggedIn = false;

      if (userMenuSesion) cerrarMenu(userMenuSesion);

      if (nombreUsuarioSpan) nombreUsuarioSpan.textContent = "Usuario";
      actualizarAvatar("U");

      // vuelve a menú sin sesión
      if (userMenuSesion && userMenuNoSesion) {
        userMenuSesion.classList.add("hidden");
        userMenuNoSesion.classList.remove("hidden");
      }
    });
  }

  // =======================
  // Offcanvas menú móvil
  // =======================

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
      // si querés cerrar al hacer click fuera, descomentá:
      // cerrarOffcanvas();
    }
  });

  // =======================
  // Carrito lateral
  // =======================

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

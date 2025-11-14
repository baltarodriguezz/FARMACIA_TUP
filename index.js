// ========================
// CONFIGURACIÓN GENERAL
// ========================
const API_BASE_URL = "https://localhost:7028";

let isLoggedIn = false;
let currentOpenUserMenu = null;

// ========================
// UTILIDADES
// ========================
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

// ========================
// INICIO
// ========================
document.addEventListener("DOMContentLoaded", () => {

  // --------------------------
  // ELEMENTOS DEL MENÚ MÓVIL
  // --------------------------
  const menu = document.getElementById("menuOffcanvas");
  const overlay = document.getElementById("overlay");
  const btnAbrir = document.getElementById("btnAbrir");
  const btnCerrar = document.getElementById("btnCerrar");

  // Abrir/cerrar menú móvil
  if (btnAbrir) {
    btnAbrir.addEventListener("click", () => {
      menu.classList.remove("translate-x-full");
      overlay.classList.remove("opacity-0", "pointer-events-none");
    });
  }

  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      menu.classList.add("translate-x-full");
      overlay.classList.add("opacity-0", "pointer-events-none");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      menu.classList.add("translate-x-full");
      overlay.classList.add("opacity-0", "pointer-events-none");
    });
  }

  // --------------------------
  // DRAWER LATERAL (COMPRA / DETALLES)
  // --------------------------
  const drawer = document.getElementById("drawer");
  const drawerPanel = document.getElementById("drawerPanel");
  const closeDrawer = document.getElementById("closeDrawer");
  const continueShopping = document.getElementById("continueShopping");

  document.querySelector('[data-commandfor="drawer"]')?.addEventListener("click", () => {
    drawer.classList.remove("hidden");
    setTimeout(() => drawerPanel.classList.remove("translate-x-full"), 10);
  });

  function closeCart() {
    drawerPanel.classList.add("translate-x-full");
    setTimeout(() => drawer.classList.add("hidden"), 300);
  }

  closeDrawer?.addEventListener("click", closeCart);
  continueShopping?.addEventListener("click", closeCart);

  drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) closeCart();
  });

  // --------------------------
  // USUARIO: SESIÓN Y LOGIN
  // --------------------------
  const perfilBtn = document.getElementById("perfilBtn");
  const userMenuNoSesion = document.getElementById("userMenuNoSesion");
  const userMenuSesion = document.getElementById("userMenuSesion");
  const inicioSesionBtn = document.getElementById("inicio_sesion");

  const loginModal = document.getElementById("loginModal");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const loginForm = document.getElementById("loginForm");
  const loginEmailInput = document.getElementById("loginEmail");
  const loginPassInput = document.getElementById("loginPassword");
  const loginError = document.getElementById("loginError");

  const nombreUsuarioSpan = document.getElementById("nombreUsuario");
  const cerrarSesionBtn = document.getElementById("cerrarSesion");

  // Perfil
  const perfilNombreInput = document.getElementById("nombre");
  const perfilApellidoInput = document.getElementById("apellido");
  const perfilEmailInput = document.getElementById("email2");
  const perfilPassInput = document.getElementById("password");
  const perfilForm = document.getElementById("perfilForm");

  // --------------------------
  // MANEJO DE MENÚ USUARIO
  // --------------------------
  function abrirMenu(menuElement) {
    menuElement.classList.remove("hidden");
    requestAnimationFrame(() => {
      menuElement.classList.remove("translate-x-4", "opacity-0");
    });
    currentOpenUserMenu = menuElement;
  }

  function cerrarMenu(menuElement) {
    menuElement.classList.add("translate-x-4", "opacity-0");
    setTimeout(() => {
      menuElement.classList.add("hidden");
      if (currentOpenUserMenu === menuElement) currentOpenUserMenu = null;
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

  perfilBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleUserMenu();
  });

  document.addEventListener("click", (e) => {
    if (
      currentOpenUserMenu &&
      !currentOpenUserMenu.contains(e.target) &&
      e.target !== perfilBtn
    ) {
      cerrarMenu(currentOpenUserMenu);
    }
  });

  // --------------------------
  // LOGIN MODAL
  // --------------------------
  function abrirLogin() {
    loginModal?.classList.remove("hidden");
  }

  function cerrarLogin() {
    loginModal?.classList.add("hidden");
    if (loginError) {
      loginError.classList.add("hidden");
      loginError.textContent = "";
    }
    if (loginPassInput) loginPassInput.value = "";
  }

  inicioSesionBtn?.addEventListener("click", () => {
    cerrarMenu(userMenuNoSesion);
    abrirLogin();
  });

  closeLoginModal?.addEventListener("click", cerrarLogin);

  loginModal?.addEventListener("click", (e) => {
    if (e.target === loginModal) cerrarLogin();
  });

  // --------------------------
  // LOGIN REQUEST
  // --------------------------
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginEmailInput.value.trim();
    const password = loginPassInput.value;

    if (!email || !password) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Login/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.text().catch(() => "Error");
        loginError.textContent = error;
        loginError.classList.remove("hidden");
        return;
      }

      const data = await response.json();
      const token = data.token;

      if (!token) return;

      localStorage.setItem("authToken", token);
      isLoggedIn = true;

      await fetchCurrentUser();

      cerrarLogin();
      abrirMenu(userMenuSesion);

    } catch (error) {
      loginError.textContent = "No se pudo conectar con el servidor";
      loginError.classList.remove("hidden");
    }
  });

  // --------------------------
  // PERFIL: GUARDAR CAMBIOS
  // --------------------------
  perfilForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Debés iniciar sesión");
      return;
    }

    const payload = {
      nombre: perfilNombreInput?.value.trim() ?? "",
      apellido: perfilApellidoInput?.value.trim() ?? "",
      email: perfilEmailInput?.value.trim() ?? ""
    };

    const nuevaPass = perfilPassInput?.value.trim();
    if (nuevaPass) payload.password = nuevaPass;

    try {
      const res = await fetch(`${API_BASE_URL}/api/Clientes/me`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert("No se pudieron guardar los cambios");
        return;
      }

      await fetchCurrentUser();
      alert("Datos actualizados");

    } catch (err) {
      alert("Error de conexión");
    }
  });

  // --------------------------
  // OBTENER DATOS DE USUARIO
  // --------------------------
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
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        isLoggedIn = false;
        return;
      }

      const cliente = await res.json();

      const nombre =
        cliente.nombre?.trim().length > 0
          ? cliente.nombre
          : getNameFromEmail(cliente.email);

      localStorage.setItem("userName", nombre);
      nombreUsuarioSpan.textContent = nombre;

      rellenarPerfil(cliente);
      actualizarAvatar(nombre);

      userMenuSesion?.classList.remove("hidden");
      userMenuNoSesion?.classList.add("hidden");
    } catch {}
  }

  function rellenarPerfil(cliente) {
    if (perfilNombreInput) perfilNombreInput.value = cliente.nombre ?? "";
    if (perfilApellidoInput) perfilApellidoInput.value = cliente.apellido ?? "";
    if (perfilEmailInput) perfilEmailInput.value = cliente.email ?? "";
    if (perfilPassInput) perfilPassInput.value = "";
  }

  function actualizarAvatar(name) {
    const avatarSpan =
      userMenuSesion?.querySelector("div.w-9.h-9 span");
    if (avatarSpan) avatarSpan.textContent = getInitialsFromName(name);
  }

  // --------------------------
  // CERRAR SESIÓN
  // --------------------------
  cerrarSesionBtn?.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    isLoggedIn = false;

    cerrarMenu(userMenuSesion);
    nombreUsuarioSpan.textContent = "Usuario";

    actualizarAvatar("U");

    userMenuSesion?.classList.add("hidden");
    userMenuNoSesion?.classList.remove("hidden");
  });

  // --------------------------
  // CARRITO LATERAL
  // --------------------------
  const cartBtn = document.getElementById("cartBtn");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartPanel = document.getElementById("cartPanel");
  const cartCloseBtn = document.getElementById("cartCloseBtn");

  const cartEmptyState = document.getElementById("cartEmptyState");
  const cartItemsWrapper = document.getElementById("cartItemsWrapper");
  const cartItemsList = document.getElementById("cartItemsList");
  const cartTotalSpan = document.getElementById("cartTotal");
  const btnCheckout = document.getElementById("btnCheckout");

  function mostrarCarritoVacio() {
    cartEmptyState.classList.remove("hidden");
    cartItemsWrapper.classList.add("hidden");
    cartTotalSpan.textContent = "$0,00";
  }

  function dibujarCarrito(items) {
    if (!items || items.length === 0) {
      mostrarCarritoVacio();
      return;
    }

    cartEmptyState.classList.add("hidden");
    cartItemsWrapper.classList.remove("hidden");
    cartItemsList.innerHTML = "";

    let total = 0;

    items.forEach((item) => {
      const nombre = item.nombreSuministro || item.nombre || "Producto";
      const cantidad = item.cantidad || 1;
      const precio = item.precioUnitario || item.precio || 0;
      const subtotal = cantidad * precio;
      total += subtotal;

      const li = document.createElement("li");
      li.className =
        "flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2";

      li.innerHTML = `
        <div>
          <p class="text-sm font-semibold text-gray-800">${nombre}</p>
          <p class="text-xs text-gray-500">Cant: ${cantidad}</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-semibold text-gray-900">$${subtotal.toFixed(2)}</p>
        </div>
      `;

      cartItemsList.appendChild(li);
    });

    cartTotalSpan.textContent = "$" + total.toFixed(2);
  }

  function abrirCarrito() {
    cartPanel.classList.remove("translate-x-full");
    cartOverlay.classList.remove("hidden");
  }

  function cerrarCarrito() {
    cartPanel.classList.add("translate-x-full");
    cartOverlay.classList.add("hidden");
  }

  cartBtn?.addEventListener("click", abrirCarrito);
  cartCloseBtn?.addEventListener("click", cerrarCarrito);
  cartOverlay?.addEventListener("click", cerrarCarrito);
});

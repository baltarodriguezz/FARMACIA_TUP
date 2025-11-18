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

// ==================================
// ====== FUNCIÓN ADMIN AÑADIDA =====
// ==================================
/**
 * Muestra u oculta el botón del panel de administrador según el rol.
 * @param {string | number} roleId El ID del rol del usuario.
 */
function checkAdminPanel(roleId) {
  const adminBtn = document.getElementById("adminPanelBtn");
  if (!adminBtn) return;

  if (parseInt(roleId, 10) === 3) {
    adminBtn.classList.remove("hidden");
  } else {
    adminBtn.classList.add("hidden");
  }
}
// ==================================

let isLoggedIn = false;
let currentOpenUserMenu = null;

let cartEmptyState = null;
let cartItemsWrapper = null;
let cartItemsList = null;
let cartTotalSpan = null;
let btnCheckout = null;

let cartPanelTitle = null;
let cartView = null;
let checkoutView = null;
let cartFooter = null;
let checkoutFooter = null;
let sucursalSelect = null;
let formaPagoSelect = null;
let checkoutItemsList = null;
let btnConfirmarCompra = null;
let btnCancelarCheckout = null;

let cartPanel = null;
let cartOverlay = null;
let cartCloseBtn = null;

function dibujarCarrito(items) {
  if (!cartEmptyState || !cartItemsWrapper || !cartItemsList) return;

  if (!items || items.length === 0) {
    mostrarCarritoVacio();
    return;
  }

  cartEmptyState.classList.add("hidden");
  cartItemsWrapper.classList.remove("hidden");
  cartItemsList.innerHTML = "";

  let total = 0;

  items.forEach((item) => {
    const idItem = item.idItem;
    const nombre = item.descripcion || "Producto";
    const cantidad = item.cantidad || 1;
    const precio = item.precioUnitario || 0;
    const subtotal = cantidad * precio;
    total += subtotal;

    const li = document.createElement("li");
    li.className =
      "flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2";

    li.innerHTML = `
      <div class="flex-1 min-w-0 pr-2">
        <p class="text-sm font-semibold text-gray-800 truncate">${nombre}</p>
        <p class="text-xs text-gray-500">$${precio.toFixed(2)} c/u</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-restar-item text-gray-500 p-0.5 rounded-full hover:bg-gray-200" title="Restar 1">
          <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
        </button>
        <span class="font-semibold text-sm">${cantidad}</span>
        <button class="btn-sumar-item text-gray-500 p-0.5 rounded-full hover:bg-gray-200" title="Sumar 1">
          <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        </button>
      </div>
      <div class="text-right w-16">
        <p class="text-sm font-semibold text-gray-900">$${subtotal.toFixed(2)}</p>
      </div>
      <div class="ml-1">
        <button class="btn-eliminar-item text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-gray-200" title="Eliminar item">
          <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    `;

    const btnRestar = li.querySelector(".btn-restar-item");
    const btnSumar = li.querySelector(".btn-sumar-item");
    const btnEliminar = li.querySelector(".btn-eliminar-item");

    btnSumar.addEventListener("click", () => {
      actualizarCantidadItem(idItem, cantidad + 1);
    });

    btnRestar.addEventListener("click", () => {
      if (cantidad > 1) {
        actualizarCantidadItem(idItem, cantidad - 1);
      } else {
        eliminarDelCarrito(idItem);
      }
    });

    btnEliminar.addEventListener("click", () => {
      eliminarDelCarrito(idItem);
    });

    cartItemsList.appendChild(li);
  });

  if (cartTotalSpan) {
    cartTotalSpan.textContent = "$" + total.toFixed(2);
  }
}

function abrirPanelCarrito() {
  if (!cartPanel || !cartOverlay) return;
  cartPanel.classList.remove("translate-x-full");
  cartOverlay.classList.remove("hidden");
}

function cerrarCarrito() {
  if (!cartPanel || !cartOverlay) return;
  cartPanel.classList.add("translate-x-full");
  cartOverlay.classList.add("hidden");
}

function mostrarCarritoVacio() {
  if (cartEmptyState) {
    cartEmptyState.classList.remove("hidden");
  }
  if (cartItemsWrapper) {
    cartItemsWrapper.classList.add("hidden");
  }
  if (cartItemsList) {
    cartItemsList.innerHTML = "";
  }
  if (cartTotalSpan) {
    cartTotalSpan.textContent = "$0,00";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const darkOverlay = document.getElementById("darkOverlay");

  const perfilBtn = document.getElementById("perfilBtn");
  const userMenuNoSesion = document.getElementById("userMenuNoSesion");
  const userMenuSesion = document.getElementById("userMenuSesion");
  const inicioSesionBtn = document.getElementById("inicio_sesion");

  const loginModal = document.getElementById("loginModal");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const loginForm = document.getElementById("loginForm");
  const loginEmailInput = document.getElementById("email");
  const loginPassInput = document.getElementById("password");
  const loginError = document.getElementById("loginError");

  const nombreUsuarioSpan = document.getElementById("nombreUsuario");
  const cerrarSesionBtn = document.getElementById("cerrarSesion");
  const cerrarMenuSesionBtn = document.getElementById("cerrarMenuSesion");
  const nombreUsuarioMenu = document.getElementById("nombreUsuarioMenu");
  const btnAbrirLoginDesdeMenu = document.getElementById("btnAbrirLoginDesdeMenu");

  const menuOffcanvas = document.getElementById("menuOffcanvas");
  const btnAbrir = document.getElementById("btnAbrir");
  const btnCerrar = document.getElementById("btnCerrar");

  const cartBtn = document.getElementById("cartBtn");
  cartOverlay = document.getElementById("cartOverlay");
  cartPanel = document.getElementById("cartPanel");
  cartCloseBtn = document.getElementById("cartCloseBtn");

  const perfilNombreInput = document.getElementById("nombre");
  const perfilApellidoInput = document.getElementById("apellido");
  const perfilEmailInput = document.getElementById("email2");
  const perfilPassInput = document.getElementById("password");
  const perfilForm = document.getElementById("perfilForm");

  cartEmptyState = document.getElementById("cartEmptyState");
  cartItemsWrapper = document.getElementById("cartItemsWrapper");
  cartItemsList = document.getElementById("cartItemsList");
  cartTotalSpan = document.getElementById("cartTotal");
  btnCheckout = document.getElementById("btnCheckout");

  cartPanelTitle = document.getElementById("cartPanelTitle");
  cartView = document.getElementById("cartView");
  checkoutView = document.getElementById("checkoutView");
  cartFooter = document.getElementById("cartFooter");
  checkoutFooter = document.getElementById("checkoutFooter");
  sucursalSelect = document.getElementById("sucursalSelect");
  formaPagoSelect = document.getElementById("formaPagoSelect");
  checkoutItemsList = document.getElementById("checkoutItemsList");
  btnConfirmarCompra = document.getElementById("btnConfirmarCompra");
  btnCancelarCheckout = document.getElementById("btnCancelarCheckout");

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener("click", cerrarCarrito);
  }
  if (cartPanel) {
    cartPanel.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  if (btnCheckout) {
    btnCheckout.addEventListener("click", iniciarCheckout);
  }
  if (btnConfirmarCompra) {
    btnConfirmarCompra.addEventListener("click", confirmarCompra);
  }
  if (btnCancelarCheckout) {
    btnCancelarCheckout.addEventListener("click", cancelarCheckout);
  }

  const storedToken = localStorage.getItem("authToken");

  if (storedToken) {
    isLoggedIn = true;
    fetchCurrentUser();
  } else {
    isLoggedIn = false;
    checkAdminPanel(null);
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

      const payload = {
        nombre: perfilNombreInput?.value.trim() ?? "",
        apellido: perfilApellidoInput?.value.trim() ?? "",
        email: perfilEmailInput?.value.trim() ?? "",
      };

      const nuevaPass = perfilPassInput?.value.trim();
      if (nuevaPass) {
        payload.password = nuevaPass;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/Clientes/me`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("Error al actualizar perfil:", res.status, text);
          alert("No se pudieron guardar los cambios. Revisá los datos.");
          return;
        }

        await fetchCurrentUser();

        alert("Datos actualizados correctamente ✅");

        if (perfilPassInput) perfilPassInput.value = "";
      } catch (err) {
        console.error("Error de red al actualizar perfil:", err);
        alert("Hubo un problema de conexión al guardar los cambios.");
      }
    });
  }

  // =======================
  // Obtener usuario actual
  // =======================
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
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        checkAdminPanel(null);
        isLoggedIn = false;
        return;
      }

      if (!res.ok) {
        console.error("Error al obtener cliente:", res.status);
        return;
      }

      const cliente = await res.json();

      const nombre =
        cliente.nombre && cliente.nombre.trim().length > 0
          ? cliente.nombre
          : getNameFromEmail(cliente.email);

      localStorage.setItem("userName", nombre);
      localStorage.setItem("userId", cliente.idCliente);

      if (cliente.idTipoUsuario) {
        localStorage.setItem("userRole", cliente.idTipoUsuario);
        checkAdminPanel(cliente.idTipoUsuario);
      } else {
        localStorage.removeItem("userRole");
        checkAdminPanel(null);
      }

      if (nombreUsuarioSpan) {
        nombreUsuarioSpan.textContent = nombre;
      }
      actualizarAvatar(nombre);

      const greetingSpan = document.getElementById("userGreeting");
      if (greetingSpan) {
        greetingSpan.textContent = `Hola, ${nombre}`;
        greetingSpan.classList.remove("hidden");
      }

      // 👇 AQUÍ SE ACTUALIZA "Bienvenido, XXX" DEL MENÚ
      if (nombreUsuarioMenu) {
        nombreUsuarioMenu.textContent = nombre;
      }

      rellenarFormularioPerfil(cliente);

      isLoggedIn = true;

      cargarMisCompras(token);
      cargarMetodosDePago(token);
    } catch (err) {
      console.error("Error de red al obtener cliente:", err);
    }
  }

  function abrirMenu(menuElement) {
    if (!menuElement) return;

    menuElement.classList.remove("hidden");
    requestAnimationFrame(() => {
      menuElement.classList.remove("scale-95", "opacity-0", "-translate-y-3");
    });
    currentOpenUserMenu = menuElement;
  }

  function cerrarMenu(menuElement) {
    if (!menuElement) return;

    menuElement.classList.add("scale-95", "opacity-0", "-translate-y-3");

    setTimeout(() => {
      menuElement.classList.add("hidden");
      if (currentOpenUserMenu === menuElement) {
        currentOpenUserMenu = null;
      }
    }, 300);
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

    if (darkOverlay) {
      darkOverlay.classList.remove("opacity-0", "pointer-events-none");
    }

    requestAnimationFrame(() => {
      loginModal.classList.remove("opacity-0", "scale-95");
    });
  }

  function cerrarLoginModal() {
    if (!loginModal) return;

    loginModal.classList.add("opacity-0", "scale-95");

    if (darkOverlay) {
      darkOverlay.classList.add("opacity-0", "pointer-events-none");
    }

    setTimeout(() => {
      loginModal.classList.add("hidden");

      if (loginError) {
        loginError.classList.add("hidden");
        loginError.textContent = "";
      }
      if (loginPassInput) loginPassInput.value = "";
    }, 300);
  }

  if (darkOverlay) {
    darkOverlay.addEventListener("click", () => {
      cerrarLoginModal();
    });
  }

  function actualizarAvatar(name) {
    const avatarSpan = document.getElementById("userAvatar");
    if (avatarSpan) {
      avatarSpan.textContent = getInitialsFromName(
        name || nombreUsuarioSpan?.textContent
      );
    }
  }

  // =======================
  // Eventos menú usuario
  // =======================
  if (inicioSesionBtn) {
    inicioSesionBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const menuObjetivo = isLoggedIn ? userMenuSesion : userMenuNoSesion;

      if (currentOpenUserMenu === menuObjetivo) {
        cerrarMenu(menuObjetivo);
        return;
      }

      if (currentOpenUserMenu && currentOpenUserMenu !== menuObjetivo) {
        cerrarMenu(currentOpenUserMenu);
      }

      abrirMenu(menuObjetivo);
    });
  }

  if (btnAbrirLoginDesdeMenu && userMenuNoSesion) {
    btnAbrirLoginDesdeMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      cerrarMenu(userMenuNoSesion);
      abrirLoginModal();
    });
  }

  if (closeLoginModal) {
    closeLoginModal.addEventListener("click", cerrarLoginModal);
  }

  if (cerrarMenuSesionBtn) {
    cerrarMenuSesionBtn.addEventListener("click", () => {
      cerrarMenu(userMenuSesion);
    });
  }

  document.addEventListener("click", (e) => {
    if (
      currentOpenUserMenu &&
      !currentOpenUserMenu.contains(e.target) &&
      inicioSesionBtn &&
      e.target !== inicioSesionBtn &&
      !inicioSesionBtn.contains(e.target)
    ) {
      cerrarMenu(currentOpenUserMenu);
    }

    if (
      loginModal &&
      !loginModal.classList.contains("hidden") &&
      !loginModal.contains(e.target) &&
      (!inicioSesionBtn || e.target !== inicioSesionBtn)
    ) {
      cerrarLoginModal();
    }

    if (
      cartPanel &&
      !cartPanel.classList.contains("translate-x-full") &&
      !cartPanel.contains(e.target) &&
      cartBtn &&
      e.target !== cartBtn &&
      !cartBtn.contains(e.target)
    ) {
      cerrarCarrito();
    }
  });

  // =======================
  // LOGIN
  // =======================
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
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          console.error("Error login:", response.status, errorText);

          if (loginError) {
            loginError.textContent = errorText || "Credenciales incorrectas";
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

        localStorage.setItem("authToken", token);
        isLoggedIn = true;

        await fetchCurrentUser();

        cerrarLoginModal();
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

  // =======================
  // Cerrar sesión
  // =======================
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      checkAdminPanel(null);
      isLoggedIn = false;

      if (userMenuSesion) cerrarMenu(userMenuSesion);

      if (nombreUsuarioSpan) nombreUsuarioSpan.textContent = "Usuario";
      actualizarAvatar("U");

      const greetingSpan = document.getElementById("userGreeting");
      if (greetingSpan) {
        greetingSpan.classList.add("hidden");
      }
    });
  }

  const cerrarSesionPerfilBtn = document.getElementById("cerrarSesionPerfil");
  if (cerrarSesionPerfilBtn) {
    cerrarSesionPerfilBtn.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      isLoggedIn = false;
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
    btnAbrir.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirOffcanvas();
    });
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
      // si querés cerrar al hacer click fuera, podés descomentar:
      // cerrarOffcanvas();
    }
  });

  // =======================
  // Carrito lateral
  // =======================
  if (cartBtn) {
    cartBtn.addEventListener("click", async () => {
      if (!isLoggedIn) {
        alert("Inicia sesión o regístrate para acceder al Carrito");
        return;
      }

      await cargarCarritoDelServidor();
      abrirPanelCarrito();
    });
  }
});

// =======================
// LÓGICA DE "MIS COMPRAS"
// =======================
async function cargarMisCompras(token) {
  const container = document.getElementById("lista-compras-container");

  if (!container) {
    return;
  }

  const currentUserId = localStorage.getItem("userId");

  if (!token || !currentUserId) {
    console.error("No se encontró token o ID de usuario.");
    container.innerHTML =
      `<p class="text-gray-500 text-center">Debes iniciar sesión para ver tus compras.</p>`;
    return;
  }

  try {
    const [suministrosRes, facturasRes, sucursalesRes, formasPagoRes] =
      await Promise.all([
        fetch(`${API_BASE_URL}/api/Suministros`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/Factura`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/Factura/sucursales`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/Factura/formas-pago`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

    if (!suministrosRes.ok) throw new Error("Error al cargar suministros");
    if (!facturasRes.ok) throw new Error("Error al cargar facturas");
    if (!sucursalesRes.ok) throw new Error("Error al cargar sucursales");
    if (!formasPagoRes.ok) throw new Error("Error al cargar formas de pago");

    const todosLosSuministros = await suministrosRes.json();
    const todasLasFacturas = await facturasRes.json();
    const todasLasSucursales = await sucursalesRes.json();
    const todasLasFormasPago = await formasPagoRes.json();

    const suministroMap = new Map();
    todosLosSuministros.forEach((s) => {
      suministroMap.set(s.idSuministro, s.descripcion);
    });

    const sucursalMap = new Map();
    todasLasSucursales.forEach((s) => {
      sucursalMap.set(
        s.idSucursal,
        s.nombre || s.descripcion || `Sucursal #${s.idSucursal}`
      );
    });

    const formaPagoMap = new Map();
    todasLasFormasPago.forEach((f) => {
      formaPagoMap.set(
        f.idFormaPago,
        f.nombre || f.descripcion || `Forma de Pago #${f.idFormaPago}`
      );
    });

    const misFacturas = todasLasFacturas.filter(
      (factura) => factura.idCliente.toString() === currentUserId
    );

    if (misFacturas.length === 0) {
      container.innerHTML =
        `<p class="text-gray-500 text-center">Aún no has realizado ninguna compra.</p>`;
      return;
    }

    container.innerHTML = "";
    misFacturas.forEach((factura) => {
      container.innerHTML += crearHtmlFactura(
        factura,
        suministroMap,
        sucursalMap,
        formaPagoMap
      );
    });

    agregarListenersDeDetalles();
  } catch (err) {
    console.error("ERROR (cargarMisCompras):", err);
    container.innerHTML =
      `<p class="text-red-500 text-center">Error al cargar el historial de compras.</p>`;
  }
}

function crearHtmlFactura(factura, suministroMap, sucursalMap, formaPagoMap) {
  const fecha = new Date(factura.fechaEmision).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const total = factura.total.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const nombreSucursal =
    sucursalMap.get(factura.idSucursal) || `Sucursal #${factura.idSucursal}`;
  const nombreFormaPago =
    formaPagoMap.get(factura.idFormaPago) || `Pago #${factura.idFormaPago}`;

  const detallesHtml = factura.detalles
    .map((item) => {
      const nombreSuministro =
        suministroMap.get(item.idSuministro) ||
        `Suministro #${item.idSuministro}`;

      return `
        <li class="flex justify-between items-center text-sm py-2 border-b">
            <span>(Cant: ${item.cantidad}) ${nombreSuministro}</span>
            <span class="font-medium">$${(item.precioUnitario * item.cantidad).toLocaleString(
              "es-AR"
            )}</span>
        </li>
    `;
    })
    .join("");

  return `
        <div class="border rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gray-50 p-4 flex justify-between items-center">
                <div>
                    <p class="font-semibold text-gray-800">Factura #${factura.idFactura}</p>
                    <p class="text-sm text-gray-500">Fecha: ${fecha}</p>
                </div>
                <div class="text-right">
                    <p class="text-lg font-bold text-[#275c74]">${total}</p>
                    <button class="toggle-detalles text-sm text-[#12b1be] font-medium hover:underline">
                        Ver detalle
                    </button>
                </div>
            </div>
            
            <div class="detalles-factura hidden bg-white p-4">
                <div class="mb-3 pb-3 border-b space-y-1">
                    <p class="text-sm text-gray-700"><strong>Sucursal:</strong> ${nombreSucursal}</p>
                    <p class="text-sm text-gray-700"><strong>Método de Pago:</strong> ${nombreFormaPago}</p>
                </div>

                <h4 class="font-semibold mb-2">Detalle de productos:</h4>
                <ul class="space-y-1">
                    ${detallesHtml}
                </ul>
            </div>
        </div>
    `;
}

function agregarListenersDeDetalles() {
  const botones = document.querySelectorAll(".toggle-detalles");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const detallesDiv = boton
        .closest(".border")
        .querySelector(".detalles-factura");
      const estaVisible = !detallesDiv.classList.contains("hidden");

      if (estaVisible) {
        detallesDiv.classList.add("hidden");
        boton.textContent = "Ver detalle";
      } else {
        detallesDiv.classList.remove("hidden");
        boton.textContent = "Ocultar detalle";
      }
    });
  });
}

// =======================
// LÓGICA DE "MÉTODOS DE PAGO"
// =======================
async function cargarMetodosDePago(token) {
  const container = document.getElementById("lista-metodos-pago");

  if (!container) {
    return;
  }

  const currentUserId = localStorage.getItem("userId");

  if (!token || !currentUserId) {
    container.innerHTML =
      `<p class="text-gray-500 text-center">Debes iniciar sesión para ver tus métodos de pago.</p>`;
    return;
  }

  try {
    const [facturasRes, formasPagoRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/Factura`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE_URL}/api/Factura/formas-pago`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!facturasRes.ok) throw new Error("Error al cargar facturas");
    if (!formasPagoRes.ok) throw new Error("Error al cargar formas de pago");

    const todasLasFacturas = await facturasRes.json();
    const todasLasFormasPago = await formasPagoRes.json();

    const formaPagoMap = new Map();
    todasLasFormasPago.forEach((f) => {
      formaPagoMap.set(
        f.idFormaPago,
        f.nombre || f.descripcion || `ID #${f.idFormaPago}`
      );
    });

    const misFacturas = todasLasFacturas.filter(
      (factura) => factura.idCliente.toString() === currentUserId
    );

    const metodosUsadosIds = new Set();
    misFacturas.forEach((factura) => {
      metodosUsadosIds.add(factura.idFormaPago);
    });

    const misMetodosDePago = [];
    metodosUsadosIds.forEach((id) => {
      misMetodosDePago.push({
        id: id,
        nombre: formaPagoMap.get(id),
      });
    });

    if (misMetodosDePago.length === 0) {
      container.innerHTML =
        `<p class="text-gray-500 text-center">Aún no has registrado ningún método de pago en tus compras.</p>`;
      return;
    }

    container.innerHTML = "";
    misMetodosDePago.forEach((metodo) => {
      container.innerHTML += crearHtmlMetodoPago(metodo);
    });
  } catch (err) {
    console.error("ERROR (cargarMetodosDePago):", err);
    container.innerHTML =
      `<p class="text-red-500 text-center">Error al cargar tus métodos de pago.</p>`;
  }
}

function crearHtmlMetodoPago(metodo) {
  const esTarjeta = metodo.nombre.toLowerCase().includes("tarjeta");
  const icono = esTarjeta
    ? `<img src="assets/img/icons8-tarjeta-50(1).png" class="w-8 h-8">`
    : `<img src="assets/img/icons8-dinero-50.png" class="w-8 h-8">`;

  return `
        <div class="border rounded-lg p-4 flex justify-between items-center bg-gray-50">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 flex items-center justify-center rounded-full">
                    ${icono}
                </div>
                <div>
                    <p class="font-semibold text-gray-800">${metodo.nombre}</p>
                    <p class="text-sm text-gray-500">Utilizado en compras anteriores</p>
                </div>
            </div>
        </div>
    `;
}

// =============================
// LÓGICA DE API DEL CARRITO
// =============================
async function cargarCarritoDelServidor() {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    mostrarCarritoVacio();
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/Carrito/cliente/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log("No se encontró carrito, creando uno nuevo...");
        return await crearCarrito(token, userId);
      }
      throw new Error(`Error ${response.status} al cargar el carrito.`);
    }

    const text = await response.text();

    if (!text) {
      console.log("Carrito existe pero body nulo (sin items).");
      return await crearCarrito(token, userId);
    }

    const carrito = JSON.parse(text);

    if (carrito.idCarrito) {
      localStorage.setItem("cartId", carrito.idCarrito);
    }

    dibujarCarrito(carrito.items || []);
    return carrito;
  } catch (err) {
    console.error("ERROR (cargarCarritoDelServidor):", err);
    mostrarCarritoVacio();
    return null;
  }
}

async function crearCarrito(token, userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Carrito`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idCliente: parseInt(userId),
      }),
    });

    if (!response.ok && response.status !== 409) {
      throw new Error("Error al crear el carrito (POST).");
    }

    const carritoCreado = await response.json().catch(() => null);

    if (carritoCreado && carritoCreado.idCarrito) {
      localStorage.setItem("cartId", carritoCreado.idCarrito);
      return carritoCreado;
    }

    console.warn(
      "POST falló o body vacío (quizás 409 Conflict), reintentando con GET..."
    );

    const getResponse = await fetch(
      `${API_BASE_URL}/api/Carrito/cliente/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!getResponse.ok) {
      throw new Error("Error al OBTENER el carrito (GET) después de crearlo.");
    }

    const text = await getResponse.text();
    if (!text) {
      throw new Error("La API sigue devolviendo body nulo después de GET.");
    }

    const carritoExistente = JSON.parse(text);
    if (carritoExistente.idCarrito) {
      localStorage.setItem("cartId", carritoExistente.idCarrito);
    }
    return carritoExistente;
  } catch (err) {
    console.error("ERROR (crearCarrito):", err);
    return null;
  }
}

async function agregarAlCarrito(idSuministro, precioUnitario, cantidad = 1) {
  const token = localStorage.getItem("authToken");
  let cartId = localStorage.getItem("cartId");

  if (!token || !isLoggedIn) {
    alert("Debes iniciar sesión para agregar productos al carrito.");
    const loginModal = document.getElementById("loginModal");
    if (loginModal && loginModal.classList.contains("hidden")) {
      const event = new Event("click");
      document.getElementById("inicio_sesion")?.dispatchEvent(event);
    }
    return;
  }

  if (!cartId) {
    console.log("No hay ID de carrito, cargando/creando uno...");
    const carrito = await cargarCarritoDelServidor();

    if (carrito && carrito.idCarrito) {
      cartId = carrito.idCarrito;
    } else {
      alert("Hubo un problema al crear tu carrito. Intenta de nuevo.");
      return;
    }
  }

  const itemPayload = {
    idSuministro: idSuministro,
    cantidad: cantidad,
    precioUnitario: precioUnitario,
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/Carrito/${cartId}/items`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Error al agregar el producto." }));
      throw new Error(errorData.message || "Error desconocido al agregar.");
    }

    await cargarCarritoDelServidor();
    abrirPanelCarrito();
  } catch (err) {
    console.error("ERROR (agregarAlCarrito):", err);
    alert(`Error: ${err.message}`);
  }
}

async function eliminarDelCarrito(idItem) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Sesión expirada. Vuelve a iniciar sesión.");
    return;
  }

  if (!confirm("¿Quitar este producto del carrito?")) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/Carrito/items/${idItem}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar el producto.");
    }

    await cargarCarritoDelServidor();
  } catch (err) {
    console.error("ERROR (eliminarDelCarrito):", err);
    alert(err.message);
  }
}

async function actualizarCantidadItem(idItem, nuevaCantidad) {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  const payload = {
    cantidad: nuevaCantidad,
    idSuministro: 0,
    precioUnitario: 0,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/Carrito/items/${idItem}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("No se pudo actualizar la cantidad.");
    }

    await cargarCarritoDelServidor();
  } catch (err) {
    console.error("ERROR (actualizarCantidadItem):", err);
    alert(err.message);
  }
}

// =============================
// LÓGICA DE CHECKOUT
// =============================
function cancelarCheckout() {
  if (checkoutView) checkoutView.classList.add("hidden");
  if (checkoutFooter) checkoutFooter.classList.add("hidden");

  if (cartView) cartView.classList.remove("hidden");
  if (cartFooter) cartFooter.classList.remove("hidden");

  if (cartPanelTitle) cartPanelTitle.textContent = "Mi Carrito";
}

async function iniciarCheckout() {
  if (!cartItemsList || cartItemsList.children.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  if (cartView) cartView.classList.add("hidden");
  if (cartFooter) cartFooter.classList.add("hidden");

  if (checkoutView) checkoutView.classList.remove("hidden");
  if (checkoutFooter) checkoutFooter.classList.remove("hidden");

  if (cartPanelTitle) cartPanelTitle.textContent = "Finalizar Compra";

  if (checkoutItemsList) {
    checkoutItemsList.innerHTML = "";
    const items = cartItemsList.querySelectorAll("li");
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.querySelector(".btn-restar-item")?.remove();
      clone.querySelector(".btn-sumar-item")?.remove();
      clone.querySelector(".btn-eliminar-item")?.remove();
      clone.classList.add("py-2", "border-b");
      clone.classList.remove("bg-gray-50", "px-3", "py-2", "gap-3");
      checkoutItemsList.appendChild(clone);
    });
  }

  await poblarDropdowns();
}

async function poblarDropdowns() {
  const token = localStorage.getItem("authToken");
  if (!token || !sucursalSelect || !formaPagoSelect) return;

  sucursalSelect.innerHTML = `<option value="">Cargando...</option>`;
  formaPagoSelect.innerHTML = `<option value="">Cargando...</option>`;

  try {
    const [sucursalesRes, formasPagoRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/Factura/sucursales`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE_URL}/api/Factura/formas-pago`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!sucursalesRes.ok || !formasPagoRes.ok) {
      throw new Error("Error al cargar datos de checkout");
    }

    const sucursales = await sucursalesRes.json();
    const formasPago = await formasPagoRes.json();

    sucursalSelect.innerHTML =
      `<option value="">-- Seleccione una sucursal --</option>`;
    sucursales.forEach((s) => {
      sucursalSelect.innerHTML += `<option value="${s.idSucursal}">${
        s.nombre || s.descripcion
      }</option>`;
    });

    formaPagoSelect.innerHTML =
      `<option value="">-- Seleccione un método de pago --</option>`;
    formasPago.forEach((f) => {
      formaPagoSelect.innerHTML += `<option value="${f.idFormaPago}">${
        f.nombre || f.descripcion
      }</option>`;
    });
  } catch (err) {
    console.error("ERROR (poblarDropdowns):", err);
    sucursalSelect.innerHTML = `<option value="">Error al cargar</option>`;
    formaPagoSelect.innerHTML = `<option value="">Error al cargar</option>`;
  }
}

async function confirmarCompra() {
  const token = localStorage.getItem("authToken");
  const cartId = localStorage.getItem("cartId");

  const idSucursal = sucursalSelect?.value;
  const idFormaPago = formaPagoSelect?.value;

  if (!idSucursal || !idFormaPago) {
    alert("Por favor, selecciona una sucursal y un método de pago.");
    return;
  }

  if (!token || !cartId) {
    alert("Error de sesión o carrito no encontrado. Intenta recargar la página.");
    return;
  }

  btnConfirmarCompra.disabled = true;
  btnConfirmarCompra.textContent = "Procesando...";

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/Carrito/${cartId}/checkout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idSucursal: parseInt(idSucursal),
          idFormaPago: parseInt(idFormaPago),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Error al procesar el pago." }));
      throw new Error(errorData.message || "Error desconocido al confirmar.");
    }

    alert("¡Compra realizada con éxito! Se ha generado tu factura.");

    localStorage.removeItem("cartId");

    cerrarCarrito();
    mostrarCarritoVacio();
    cancelarCheckout();
  } catch (err) {
    console.error("ERROR (confirmarCompra):", err);
    alert(`Error al procesar la compra: ${err.message}`);
  } finally {
    btnConfirmarCompra.disabled = false;
    btnConfirmarCompra.textContent = "Confirmar Compra";
  }
}

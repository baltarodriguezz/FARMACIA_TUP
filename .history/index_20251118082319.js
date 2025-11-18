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
  if (!adminBtn) return; // No hacer nada si el botón no existe

  // Compara como número (tu API devuelve 3)
  if (parseInt(roleId, 10) === 3) {
    adminBtn.classList.remove("hidden");
  } else {
    adminBtn.classList.add("hidden");
  }
}
// ==================================


let isLoggedIn = false;
let currentOpenUserMenu = null;

let cartEmptyState  = null;
let cartItemsWrapper= null;
let cartItemsList   = null;
let cartTotalSpan   = null;
let btnCheckout     = null;

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

let cartPanel     = null;
let cartOverlay   = null;
let cartCloseBtn  = null;

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
    li.className = "flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2";

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

    // ----- AQUÍ ESTÁN LOS CAMBIOS -----

    const btnRestar = li.querySelector('.btn-restar-item');
    const btnSumar = li.querySelector('.btn-sumar-item');
    const btnEliminar = li.querySelector('.btn-eliminar-item');

    // Listener para SUMAR
    btnSumar.addEventListener('click', (e) => {
      actualizarCantidadItem(idItem, cantidad + 1);
    });

    // Listener para RESTAR
    btnRestar.addEventListener('click', (e) => {
      if (cantidad > 1) {
        actualizarCantidadItem(idItem, cantidad - 1);
      } else {
        eliminarDelCarrito(idItem);
      }
    });

    // Listener para ELIMINAR
    btnEliminar.addEventListener('click', (e) => {
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
    cartItemsList.innerHTML = ""; // Limpiamos por si acaso
  }
  if (cartTotalSpan) {
    cartTotalSpan.textContent = "$0,00"; // Reseteamos el total
  }
}

document.addEventListener("DOMContentLoaded", () => {


  const perfilBtn       = document.getElementById("perfilBtn");
  const userMenuNoSesion = document.getElementById("userMenuNoSesion");
  const userMenuSesion   = document.getElementById("userMenuSesion");
  const inicioSesionBtn  = document.getElementById("inicio_sesion");

  const loginModal      = document.getElementById("loginModal");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const loginForm       = document.getElementById("loginForm");
  const loginEmailInput = document.getElementById("email");
  const loginPassInput  = document.getElementById("password");
  const loginError      = document.getElementById("loginError");

  const nombreUsuarioSpan = document.getElementById("nombreUsuario");
  const cerrarSesionBtn   = document.getElementById("cerrarSesion");
  const closeUserMenuBtn = document.getElementById("closeUserMenuBtn");


  const menuOffcanvas = document.getElementById("menuOffcanvas");
  const btnAbrir      = document.getElementById("btnAbrir");
  const btnCerrar     = document.getElementById("btnCerrar");

 
  const cartBtn     = document.getElementById("cartBtn");
  cartOverlay = document.getElementById("cartOverlay");
  cartPanel   = document.getElementById("cartPanel");
  cartCloseBtn = document.getElementById("cartCloseBtn");

const perfilNombreInput   = document.getElementById("nombre");
const perfilApellidoInput = document.getElementById("apellido");
const perfilEmailInput    = document.getElementById("email2");
const perfilPassInput     = document.getElementById("password");
const perfilForm          = document.getElementById("perfilForm");

cartEmptyState  = document.getElementById("cartEmptyState");
cartItemsWrapper= document.getElementById("cartItemsWrapper");
cartItemsList   = document.getElementById("cartItemsList");
cartTotalSpan   = document.getElementById("cartTotal");
btnCheckout     = document.getElementById("btnCheckout")

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
  cartPanel.addEventListener(
    "click",
    (e) => {
      e.stopPropagation();
    },
  );
  }
  // ... (después de if (cartOverlay) { ... })

if (btnCheckout) {
    btnCheckout.addEventListener("click", iniciarCheckout);
}
if (btnConfirmarCompra) {
    btnConfirmarCompra.addEventListener("click", confirmarCompra);
}
if (btnCancelarCheckout) {
    btnCancelarCheckout.addEventListener("click", cancelarCheckout);
}

  // ---------- RENDER DEL CARRITO ----------
  const storedToken = localStorage.getItem("authToken");

  if (storedToken) {
    isLoggedIn = true;
    fetchCurrentUser(); // Esto ahora también revisará el rol
  } else {
    isLoggedIn = false;
    // ==================================
    // ====== MODIFICACIÓN AÑADIDA ======
    // ==================================
    // Nos aseguramos que el botón admin esté oculto si no hay sesión
    checkAdminPanel(null); 
    // ==================================
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
        method: "PUT",           // o "PATCH" según tu API
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
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole"); // Limpiamos el rol
        checkAdminPanel(null);               // Ocultamos el botón
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
      localStorage.setItem("userId", cliente.idCliente);

      // ==================================
      // ====== LÓGICA DE ROL CORREGIDA =====
      // ==================================
      
      // Asumimos que el cliente tiene un campo "idTipoUsuario" (camelCase)
      // Esta es la línea que cambiamos:
      if (cliente.idTipoUsuario) { 
        localStorage.setItem("userRole", cliente.idTipoUsuario);
        checkAdminPanel(cliente.idTipoUsuario); // Muestra/oculta el botón
      } else {
        // Si no viene el rol, lo limpiamos por seguridad
        localStorage.removeItem("userRole");
        checkAdminPanel(null); // Oculta el botón
      }
      // ==================================


      if (nombreUsuarioSpan) {
        nombreUsuarioSpan.textContent = nombre;
      }
      actualizarAvatar(nombre);

      const greetingSpan = document.getElementById("userGreeting");
      if (greetingSpan) {
          greetingSpan.textContent = `Hola, ${nombre}`;
          greetingSpan.classList.remove("hidden");
      }

      // si existe el formulario de perfil, lo completamos
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
   requestAnimationFrame(() => {
     loginModal.classList.remove("opacity-0", "scale-95");
   });
 }

  function cerrarLoginModal() {
   if (!loginModal) return;
 
   loginModal.classList.add("opacity-0", "scale-95");
   
   // Esperamos que termine la animación (300ms) para ocultarlo
   setTimeout(() => {
     loginModal.classList.add("hidden");
     
     // Limpieza de formulario
     if (loginError) {
       loginError.classList.add("hidden");
       loginError.textContent = "";
     }
     if (loginPassInput) loginPassInput.value = "";
 
   }, 300); // Debe coincidir con la duration-300
 }

  function actualizarAvatar(name) {
    const avatarSpan = document.getElementById("userAvatar")
    if (avatarSpan) {
      avatarSpan.textContent = getInitialsFromName(
        name || nombreUsuarioSpan?.textContent
      );
    }
  }

  // =======================
// Eventos: menú usuario
// =======================

// 1. LÓGICA DEL BOTÓN DE ÍCONO DE USUARIO (el que tiene id="inicio_sesion")
if (inicioSesionBtn) {
  inicioSesionBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    
    // Si estás logueado, abre el menú de usuario.
    if (isLoggedIn) {
      // Si hay otro menú abierto (como el modal de login), ciérralo.
      if (currentOpenUserMenu && currentOpenUserMenu !== userMenuSesion) {
        cerrarMenu(currentOpenUserMenu);
      }
      // Abre el menú de sesión
      abrirMenu(userMenuSesion); 
    } 
    // Si no estás logueado, abre el modal de login.
    else {
      abrirLoginModal();
    }
  });
}

// 2. CERRAR EL MODAL DE LOGIN (Botón "X")
if (closeLoginModal) {
  closeLoginModal.addEventListener("click", cerrarLoginModal);
}

// 3. CERRAR EL MENÚ DE SESIÓN (Botón "X")
if (closeUserMenuBtn) {
  closeUserMenuBtn.addEventListener("click", () => {
    cerrarMenu(userMenuSesion);
  });
}

// 4. CERRAR MODALES HACIENDO CLICK FUERA
document.addEventListener("click", (e) => {
  if (currentOpenUserMenu && !currentOpenUserMenu.contains(e.target) && e.target !== inicioSesionBtn && !inicioSesionBtn.contains(e.target)) {
    cerrarMenu(currentOpenUserMenu);
  }
  
  // Lógica de cerrar modal de login al hacer click fuera
if (loginModal && !loginModal.classList.contains("hidden") && !loginModal.contains(e.target) && e.target !== inicioSesionBtn) {
      cerrarLoginModal();
  }

if (cartPanel && !cartPanel.classList.contains("translate-x-full") && !cartPanel.contains(e.target) &&       
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
        // fetchCurrentUser() AHORA revisará el rol y mostrará el botón admin si aplica
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
      // ==================================
      // ====== MODIFICACIÓN AÑADIDA ======
      // ==================================
      localStorage.removeItem("userRole"); // Limpia el rol
      checkAdminPanel(null);               // Oculta el botón admin
      // ==================================
      isLoggedIn = false;

      if (userMenuSesion) cerrarMenu(userMenuSesion);

      if (nombreUsuarioSpan) nombreUsuarioSpan.textContent = "Usuario";
      actualizarAvatar("U");

      const greetingSpan = document.getElementById("userGreeting");
      if (greetingSpan) {
          greetingSpan.classList.add("hidden");
      }

      // vuelve a menú sin sesión
      if (userMenuSesion) {
        cerrarMenu(userMenuSesion);
      }
    });
  }
  const cerrarSesionPerfilBtn = document.getElementById("cerrarSesionPerfil");
      if (cerrarSesionPerfilBtn) {
        cerrarSesionPerfilBtn.addEventListener("click", () => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userName");
          localStorage.removeItem("userId");
          // ==================================
          // ====== MODIFICACIÓN AÑADIDA ======
          // ==================================
          localStorage.removeItem("userRole"); // Limpia el rol
          // checkAdminPanel(null); // No es necesario, la página redirigirá
          // ==================================
          isLoggedIn = false; // Asegúrate de actualizar el estado

          // No necesitamos ocultar menús aquí, porque va a redirigir
          // Simplemente nos aseguramos de que el token esté borrado antes de ir a index.html
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
      // si querés cerrar al hacer click fuera, descomentá:
      // cerrarOffcanvas();
    }
  });

  // =======================
  // Carrito lateral
  // =======================
  if (cartBtn) {
    cartBtn.addEventListener("click", async () => {
      
      // 1. Revisa si está logueado
      if (!isLoggedIn) {
        alert("Inicia sesión o regístrate para acceder al Carrito");
        return;
      }

      // 2. Si está logueado, carga el carrito y abre el panel
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
        container.innerHTML = `<p class="text-gray-500 text-center">Debes iniciar sesión para ver tus compras.</p>`;
        return;
    }

    try {
        // 1. Pedimos TODAS las listas (Suministros, Facturas, Sucursales, Formas de Pago)
        const [suministrosRes, facturasRes, sucursalesRes, formasPagoRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/Suministros`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/api/Factura`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/api/Factura/sucursales`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/api/Factura/formas-pago`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!suministrosRes.ok) throw new Error('Error al cargar suministros');
        if (!facturasRes.ok) throw new Error('Error al cargar facturas');
        if (!sucursalesRes.ok) throw new Error('Error al cargar sucursales');
        if (!formasPagoRes.ok) throw new Error('Error al cargar formas de pago');

        const todosLosSuministros = await suministrosRes.json();
        const todasLasFacturas = await facturasRes.json();
        const todasLasSucursales = await sucursalesRes.json();
        const todasLasFormasPago = await formasPagoRes.json();

        // 2. Creamos los "diccionarios" (Map) para buscar nombres por ID
        // (Asumo que los objetos de sucursal y forma de pago tienen 'id' y 'nombre' o 'descripcion')
        const suministroMap = new Map();
        todosLosSuministros.forEach(s => {
            suministroMap.set(s.idSuministro, s.descripcion);
        });

        const sucursalMap = new Map();
        // Ajusta 'idSucursal' y 'nombre' si tus endpoints devuelven nombres diferentes
        todasLasSucursales.forEach(s => {
            sucursalMap.set(s.idSucursal, s.nombre || s.descripcion || `Sucursal #${s.idSucursal}`); 
        });

        const formaPagoMap = new Map();
         // Ajusta 'idFormaPago' y 'nombre' si tus endpoints devuelven nombres diferentes
        todasLasFormasPago.forEach(f => {
            formaPagoMap.set(f.idFormaPago, f.nombre || f.descripcion || `Forma de Pago #${f.idFormaPago}`);
        });

        // 3. Filtramos las facturas del cliente (esto sigue igual)
        const misFacturas = todasLasFacturas.filter(factura => 
            factura.idCliente.toString() === currentUserId
        );
        
        if (misFacturas.length === 0) {
            container.innerHTML = `<p class="text-gray-500 text-center">Aún no has realizado ninguna compra.</p>`;
            return;
        }

        container.innerHTML = '';
        misFacturas.forEach(factura => {
            // 4. Le pasamos TODOS los diccionarios a la función que dibuja el HTML
            container.innerHTML += crearHtmlFactura(factura, suministroMap, sucursalMap, formaPagoMap);
        });

        agregarListenersDeDetalles();

    } catch (err) {
        console.error("ERROR (cargarMisCompras):", err);
        container.innerHTML = `<p class="text-red-500 text-center">Error al cargar el historial de compras.</p>`;
    }
}

function crearHtmlFactura(factura, suministroMap, sucursalMap, formaPagoMap) {
    const fecha = new Date(factura.fechaEmision).toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
    const total = (factura.total).toLocaleString('es-AR', {
        style: 'currency', currency: 'ARS'
    });

    const nombreSucursal = sucursalMap.get(factura.idSucursal) || `Sucursal #${factura.idSucursal}`;
    const nombreFormaPago = formaPagoMap.get(factura.idFormaPago) || `Pago #${factura.idFormaPago}`;

    const detallesHtml = factura.detalles.map(item => {
        const nombreSuministro = suministroMap.get(item.idSuministro) || `Suministro #${item.idSuministro}`;

        return `
        <li class="flex justify-between items-center text-sm py-2 border-b">
            <span>(Cant: ${item.cantidad}) ${nombreSuministro}</span>
            <span class="font-medium">$${(item.precioUnitario * item.cantidad).toLocaleString('es-AR')}</span>
        </li>
    `}).join('');

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

// Esta función agrega el click a los botones "Ver detalle"
function agregarListenersDeDetalles() {
    const botones = document.querySelectorAll('.toggle-detalles');
    
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            const detallesDiv = boton.closest('.border').querySelector('.detalles-factura');
            const estaVisible = !detallesDiv.classList.contains('hidden');
            
            if (estaVisible) {
                detallesDiv.classList.add('hidden');
                boton.textContent = 'Ver detalle';
            } else {
                detallesDiv.classList.remove('hidden');
                boton.textContent = 'Ocultar detalle';
            }
        });
    });
}

// =======================
// LÓGICA DE "MÉTODOS DE PAGO"
// =======================

async function cargarMetodosDePago(token) {
    const container = document.getElementById("lista-metodos-pago");
    
    // Si no estamos en la página de "Métodos de Pago", no hacer nada
    if (!container) {
      return; 
    }

    const currentUserId = localStorage.getItem("userId");

    if (!token || !currentUserId) {
        container.innerHTML = `<p class="text-gray-500 text-center">Debes iniciar sesión para ver tus métodos de pago.</p>`;
        return;
    }

    try {
        // 1. Pedimos AMBAS listas al mismo tiempo
        const [facturasRes, formasPagoRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/Factura`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/api/Factura/formas-pago`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!facturasRes.ok) throw new Error('Error al cargar facturas');
        if (!formasPagoRes.ok) throw new Error('Error al cargar formas de pago');

        const todasLasFacturas = await facturasRes.json();
        const todasLasFormasPago = await formasPagoRes.json();

        // 2. Creamos un "diccionario" (Map) con todas las formas de pago
        const formaPagoMap = new Map();
        todasLasFormasPago.forEach(f => {
            // Asumo que el objeto es { idFormaPago: 1, nombre: "Efectivo" }
            // Ajusta "nombre" si la propiedad se llama "descripcion"
            formaPagoMap.set(f.idFormaPago, f.nombre || f.descripcion || `ID #${f.idFormaPago}`);
        });

        // 3. Filtramos las facturas del cliente
        const misFacturas = todasLasFacturas.filter(factura => 
            factura.idCliente.toString() === currentUserId
        );
        
        // 4. Creamos un Set para guardar solo los IDs únicos de los métodos de pago que usó
        const metodosUsadosIds = new Set();
        misFacturas.forEach(factura => {
            metodosUsadosIds.add(factura.idFormaPago);
        });

        // 5. Convertimos el Set en un Array de objetos de pago (ID + Nombre)
        const misMetodosDePago = [];
        metodosUsadosIds.forEach(id => {
            misMetodosDePago.push({
                id: id,
                nombre: formaPagoMap.get(id) // Buscamos el nombre en el diccionario
            });
        });

        // 6. Mostramos el resultado
        if (misMetodosDePago.length === 0) {
            container.innerHTML = `<p class="text-gray-500 text-center">Aún no has registrado ningún método de pago en tus compras.</p>`;
            return;
        }

        container.innerHTML = ''; // Limpiar "Cargando..."
        misMetodosDePago.forEach(metodo => {
            container.innerHTML += crearHtmlMetodoPago(metodo);
        });

    } catch (err) {
        console.error("ERROR (cargarMetodosDePago):", err);
        container.innerHTML = `<p class="text-red-500 text-center">Error al cargar tus métodos de pago.</p>`;
    }
}

// Esta función crea el HTML para CADA método de pago
function crearHtmlMetodoPago(metodo) {
    // Detectamos si es tarjeta (esto es un supuesto, ajusta la lógica si es necesario)
    const esTarjeta = metodo.nombre.toLowerCase().includes('tarjeta');
    const icono = esTarjeta 
        ? `<img src="assets/img/icons8-tarjeta-50(1).png" class="w-8 h-8">`
        : `<img src="assets/img/icons8-dinero-50.png" class="w-8 h-8">`; // Asumimos efectivo o similar

    return `
        <div class="border rounded-lg p-4 flex justify-between items-center bg-gray-50">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 flex items-center justify-center rounded-full">
                    ${metodo.id}
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
// LÓGICA DE API DEL CARRITO (CORREGIDA)
// =============================

// Esta función AHORA SÍ DEVUELVE EL CARRITO
async function cargarCarritoDelServidor() {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
        mostrarCarritoVacio();
        return null; // No hay usuario, no hay carrito
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Carrito/cliente/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.log("No se encontró carrito, creando uno nuevo...");
                return await crearCarrito(token, userId); // Devuelve el carrito recién creado
            }
            throw new Error(`Error ${response.status} al cargar el carrito.`);
        }

        const text = await response.text();
        
        // ESTA ES LA CORRECCIÓN CLAVE:
        if (!text) {
            console.log("Carrito existe pero body nulo (sin items).");
            // Si la API devuelve body nulo, no podemos obtener el ID.
            // La única forma de obtenerlo es si la API lo devuelve al CREARLO.
            // Forzamos la creación (que dará 409) y esperamos que eso devuelva el ID.
            return await crearCarrito(token, userId);
        }

        const carrito = JSON.parse(text);
        
        if (carrito.idCarrito) {
            localStorage.setItem("cartId", carrito.idCarrito);
        }
        
        dibujarCarrito(carrito.items || []);
        return carrito; // Devuelve el carrito encontrado

    } catch (err) {
        console.error("ERROR (cargarCarritoDelServidor):", err);
        mostrarCarritoVacio();
        return null; // Devuelve null si falla
    }
}

// Esta función AHORA SÍ DEVUELVE EL CARRITO
async function crearCarrito(token, userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Carrito`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idCliente: parseInt(userId)
            })
        });

        // Si falla (y NO es 409 Conflict), es un error.
        if (!response.ok && response.status !== 409) {
            throw new Error('Error al crear el carrito (POST).');
        }

        // Si la API devuelve 201 (Created) o 200 (OK) con el carrito:
        const carritoCreado = await response.json().catch(() => null);

        if (carritoCreado && carritoCreado.idCarrito) {
            localStorage.setItem("cartId", carritoCreado.idCarrito);
            return carritoCreado; // Devuelve el carrito nuevo
        }

        // Si el POST da 409 (Conflict) O el body del POST estaba vacío:
        // Hacemos un GET para obtener el carrito que ya existe.
        console.warn("POST falló o body vacío (quizás 409 Conflict), reintentando con GET...");
        
        const getResponse = await fetch(`${API_BASE_URL}/api/Carrito/cliente/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!getResponse.ok) {
             throw new Error('Error al OBTENER el carrito (GET) después de crearlo.');
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
        return null; // Falló la creación
    }
}

// Esta función se llamará desde los botones "Agregar"
async function agregarAlCarrito(idSuministro, precioUnitario, cantidad = 1) {
    const token = localStorage.getItem("authToken");
    let cartId = localStorage.getItem("cartId");

    if (!token || !isLoggedIn) {
        alert("Debes iniciar sesión para agregar productos al carrito.");
        abrirLoginModal();
        return;
    }

    // 2. Verificar si tenemos un ID de carrito
    if (!cartId) {
        console.log("No hay ID de carrito, cargando/creando uno...");
        // AHORA `cargarCarritoDelServidor` devuelve el carrito (o null)
        const carrito = await cargarCarritoDelServidor(); 
        
        if (carrito && carrito.idCarrito) {
            cartId = carrito.idCarrito;
        } else {
             alert("Hubo un problema al crear tu carrito. Intenta de nuevo.");
             return;
        }
    }

    // 3. Preparar el item a agregar (payload)
    const itemPayload = {
        idSuministro: idSuministro,
        cantidad: cantidad,
        precioUnitario: precioUnitario
    };

    try {
        // 4. Hacer POST a /api/Carrito/{idCarrito}/items
        const response = await fetch(`${API_BASE_URL}/api/Carrito/${cartId}/items`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemPayload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error al agregar el producto.' }));
            throw new Error(errorData.message || 'Error desconocido al agregar.');
        }

        // 5. Si todo sale bien, recargamos y abrimos el carrito
        await cargarCarritoDelServidor(); // Recarga el carrito con el nuevo item
        abrirPanelCarrito(); // Muestra el carrito actualizado

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

  // Confirmamos antes de borrar
  if (!confirm("¿Quitar este producto del carrito?")) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/Carrito/items/${idItem}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar el producto.");
    }

    // Si se eliminó, recargamos el carrito para ver los cambios
    await cargarCarritoDelServidor();

  } catch (err) {
    console.error("ERROR (eliminarDelCarrito):", err);
    alert(err.message);
  }
}
async function actualizarCantidadItem(idItem, nuevaCantidad) {
  const token = localStorage.getItem("authToken");
  if (!token) return; // No es necesario alertar en cada click

  // El backend (CarritoService) solo usa "Cantidad" del DTO.
  // Le pasamos los otros campos en 0 o vacíos.
  const payload = {
    cantidad: nuevaCantidad,
    idSuministro: 0, // El backend no lo usa para actualizar
    precioUnitario: 0 // El backend no lo usa para actualizar
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/Carrito/items/${idItem}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("No se pudo actualizar la cantidad.");
    }

    // Si se actualizó, recargamos el carrito
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
    // Ocultar vista de checkout
    if (checkoutView) checkoutView.classList.add("hidden");
    if (checkoutFooter) checkoutFooter.classList.add("hidden");

    // Mostrar vista de carrito
    if (cartView) cartView.classList.remove("hidden");
    if (cartFooter) cartFooter.classList.remove("hidden");

    // Restaurar título
    if (cartPanelTitle) cartPanelTitle.textContent = "Mi Carrito";
}

async function iniciarCheckout() {
    // 1. Verificar que el carrito no esté vacío
    if (!cartItemsList || cartItemsList.children.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // 2. Ocultar vista de carrito
    if (cartView) cartView.classList.add("hidden");
    if (cartFooter) cartFooter.classList.add("hidden");

    // 3. Mostrar vista de checkout
    if (checkoutView) checkoutView.classList.remove("hidden");
    if (checkoutFooter) checkoutFooter.classList.remove("hidden");

    // 4. Cambiar título
    if (cartPanelTitle) cartPanelTitle.textContent = "Finalizar Compra";

    // 5. Copiar items del carrito al resumen
    if (checkoutItemsList) {
        checkoutItemsList.innerHTML = ''; // Limpiar resumen
        const items = cartItemsList.querySelectorAll("li");
        items.forEach(item => {
            // Clonamos el item para no moverlo
            const clone = item.cloneNode(true);
            // Quitamos los botones de +/-/eliminar del resumen
            clone.querySelector('.btn-restar-item')?.remove();
            clone.querySelector('.btn-sumar-item')?.remove();
            clone.querySelector('.btn-eliminar-item')?.remove();
            clone.classList.add("py-2", "border-b"); // Estilo simple
            clone.classList.remove("bg-gray-50", "px-3", "py-2", "gap-3");
            checkoutItemsList.appendChild(clone);
        });
    }

    // 6. Poblar los dropdowns
    await poblarDropdowns();
}

async function poblarDropdowns() {
    const token = localStorage.getItem("authToken");
    if (!token || !sucursalSelect || !formaPagoSelect) return;

    // Seteamos estado de "cargando"
    sucursalSelect.innerHTML = `<option value="">Cargando...</option>`;
    formaPagoSelect.innerHTML = `<option value="">Cargando...</option>`;

    try {
        const [sucursalesRes, formasPagoRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/Factura/sucursales`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/api/Factura/formas-pago`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!sucursalesRes.ok || !formasPagoRes.ok) {
            throw new Error("Error al cargar datos de checkout");
        }

        const sucursales = await sucursalesRes.json();
        const formasPago = await formasPagoRes.json();

        // Poblar Sucursales
        sucursalSelect.innerHTML = `<option value="">-- Seleccione una sucursal --</option>`;
        sucursales.forEach(s => {
            // Asumo que el objeto es { idSucursal: 1, nombre: "..." }
            sucursalSelect.innerHTML += `<option value="${s.idSucursal}">${s.nombre || s.descripcion}</option>`;
        });

        // Poblar Formas de Pago
        formaPagoSelect.innerHTML = `<option value="">-- Seleccione un método de pago --</option>`;
        formasPago.forEach(f => {
            // Asumo que el objeto es { idFormaPago: 1, nombre: "..." }
            formaPagoSelect.innerHTML += `<option value="${f.idFormaPago}">${f.nombre || f.descripcion}</option>`;
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
    
    // 1. Validar selección
    const idSucursal = sucursalSelect.value;
    const idFormaPago = formaPagoSelect.value;

    if (!idSucursal || !idFormaPago) {
        alert("Por favor, selecciona una sucursal y un método de pago.");
        return;
    }

    if (!token || !cartId) {
        alert("Error de sesión o carrito no encontrado. Intenta recargar la página.");
        return;
    }

    // Deshabilitar botón para evitar doble click
    btnConfirmarCompra.disabled = true;
    btnConfirmarCompra.textContent = "Procesando...";

    try {
        // 2. Llamar al endpoint de CHECKOUT
        // (Tu API /api/Carrito/{idCarrito}/checkout espera un body con los IDs)
        const response = await fetch(`${API_BASE_URL}/api/Carrito/${cartId}/checkout`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idSucursal: parseInt(idSucursal),
                idFormaPago: parseInt(idFormaPago)
                // Tu API se encargará de convertir el Carrito en Factura
            })
        });

        if (!response.ok) {
             const errorData = await response.json().catch(() => ({ message: 'Error al procesar el pago.' }));
            throw new Error(errorData.message || 'Error desconocido al confirmar.');
        }

        // 3. Éxito
        alert("¡Compra realizada con éxito! Se ha generado tu factura.");
        
        // Limpiamos el cartId viejo
        localStorage.removeItem("cartId"); 
        
        // Cerramos y reseteamos el carrito
        cerrarCarrito();
        mostrarCarritoVacio(); 
        
        // Volvemos a poner el panel en modo "Carrito" (para la próxima vez que se abra)
        cancelarCheckout(); 

    } catch (err) {
        console.error("ERROR (confirmarCompra):", err);
        alert(`Error al procesar la compra: ${err.message}`);
    } finally {
        // Reactivar botón
        btnConfirmarCompra.disabled = false;
        btnConfirmarCompra.textContent = "Confirmar Compra";
    }
}
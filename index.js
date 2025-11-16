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
  const loginEmailInput = document.getElementById("email");
  const loginPassInput  = document.getElementById("password");
  const loginError      = document.getElementById("loginError");

  const nombreUsuarioSpan = document.getElementById("nombreUsuario");
  const cerrarSesionBtn   = document.getElementById("cerrarSesion");
  const closeUserMenuBtn = document.getElementById("closeUserMenuBtn");


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

  // ---------- REFERENCIAS DEL CARRITO ----------
  const cartEmptyState  = document.getElementById("cartEmptyState");
  const cartItemsWrapper= document.getElementById("cartItemsWrapper");
  const cartItemsList   = document.getElementById("cartItemsList");
  const cartTotalSpan   = document.getElementById("cartTotal");
  const btnCheckout     = document.getElementById("btnCheckout");

  // ---------- ABRIR / CERRAR ----------
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
    cartBtn.addEventListener("click", async () => {
      await cargarCarritoDelServidor(); // esta función la vimos antes
      abrirCarrito();
    });
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener("click", cerrarCarrito);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", cerrarCarrito);
  }

  // ---------- RENDER DEL CARRITO ----------
  function mostrarCarritoVacio() {
    if (!cartEmptyState || !cartItemsWrapper) return;
    cartEmptyState.classList.remove("hidden");
    cartItemsWrapper.classList.add("hidden");
    if (cartTotalSpan) cartTotalSpan.textContent = "$0,00";
  }

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
      // ajustá estos nombres a tu DTO real
      const nombre   = item.nombreSuministro || item.nombre || "Producto";
      const cantidad = item.cantidad || 1;
      const precio   = item.precioUnitario || item.precio || 0;
      const subtotal = cantidad * precio;
      total += subtotal;

      const li = document.createElement("li");
      li.className = "flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2";

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

    if (cartTotalSpan) {
      cartTotalSpan.textContent = "$" + total.toFixed(2);
    }
  }

  

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
      localStorage.setItem("userId", cliente.idCliente);

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
  if (loginModal && !loginModal.contains(e.target) && e.target === loginModal) {
      cerrarLoginModal();
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
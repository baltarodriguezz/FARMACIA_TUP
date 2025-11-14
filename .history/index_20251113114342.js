// --- ELEMENTOS ---
const darkOverlay = document.getElementById("dark-overlay");
const modal = document.getElementById("authentication-modal");
const cerrarModal = document.getElementById("cerrar_sesion");
const btnInicioS = document.getElementById("inicio_sesion");

// --- FUNCIONES ---

// 🔹 Abrir modal y oscurecer fondo
function abrirModal() {
  // Mostrar modal
  modal.classList.remove("hidden");
  
  // Mostrar y animar el overlay oscuro
  darkOverlay.classList.remove("hidden", "opacity-0", "pointer-events-none");
  darkOverlay.classList.add("opacity-100");

  // Evitar scroll del body
  document.body.classList.add("overflow-hidden");
}

// 🔹 Cerrar modal y restaurar fondo
function cerrarOverlay() {
  // Ocultar modal
  modal.classList.add("hidden");

  // Ocultar gradualmente el overlay
  darkOverlay.classList.add("opacity-0", "pointer-events-none");
  darkOverlay.classList.remove("opacity-100");

  // Esperar la transición para ocultarlo completamente
  setTimeout(() => darkOverlay.classList.add("hidden"), 300);

  // Permitir scroll nuevamente
  document.body.classList.remove("overflow-hidden");
}

// --- EVENTOS ---

// Botón para abrir
btnInicioS?.addEventListener("click", abrirModal);

// Botón (cruz) para cerrar
cerrarModal?.addEventListener("click", cerrarOverlay);

// Clic fuera del modal → cerrar
darkOverlay?.addEventListener("click", (e) => {
  if (e.target === darkOverlay) cerrarOverlay();
});

// Tecla ESC → cerrar
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarOverlay();
});


  // Seleccionar el botón del perfil dentro del header (evita conflictos con ids duplicados)
  const btnUsuario = document.querySelector('header #perfil');
  const menuNoSesion = document.getElementById('userMenuNoSesion');
  const menuSesion = document.getElementById('userMenuSesion');

  let usuarioLogueado = false;

  if (btnUsuario) {
    // helpers para mostrar/ocultar offcanvas con transition
    function showOffcanvas(menu) {
      if (!menu) return;
      menu.classList.remove('hidden');
      // give the browser a frame to apply the removal of hidden
      requestAnimationFrame(() => {
        menu.classList.remove('translate-x-full');
        menu.classList.add('translate-x-0');
      });
    }

    function hideOffcanvas(menu) {
      if (!menu) return;
      menu.classList.remove('translate-x-0');
      menu.classList.add('translate-x-full');
      // after transition, hide it to remove from tab order
      setTimeout(() => {
        menu.classList.add('hidden');
      }, 300);
    }

    btnUsuario.addEventListener('click', (e) => {
      // evitar que el listener global de document cierre inmediatamente
      e.stopPropagation();

      // cerrar el otro menú
      if (usuarioLogueado) {
        if (menuNoSesion) hideOffcanvas(menuNoSesion);
      } else {
        if (menuSesion) hideOffcanvas(menuSesion);
      }

      // mostrar/ocultar el menú correspondiente
      if (usuarioLogueado) {
        if (menuSesion) {
          if (menuSesion.classList.contains('hidden') || menuSesion.classList.contains('translate-x-full')) {
            showOffcanvas(menuSesion);
          } else {
            hideOffcanvas(menuSesion);
          }
        }
      } else {
        if (menuNoSesion) {
          if (menuNoSesion.classList.contains('hidden') || menuNoSesion.classList.contains('translate-x-full')) {
            showOffcanvas(menuNoSesion);
          } else {
            hideOffcanvas(menuNoSesion);
          }
        }
      }
    });
  } else {
    console.debug('btnUsuario no encontrado en header; listener omitido');
  }

  // Cerrar si se hace clic fuera del menú
  document.addEventListener('click', (e) => {
    const target = e.target;
    const esClickEnMenu = (
      (menuNoSesion && menuNoSesion.contains(target)) ||
      (menuSesion && menuSesion.contains(target)) ||
      (btnUsuario && btnUsuario.contains(target))
    );

    if (!esClickEnMenu) {
      if (menuNoSesion) menuNoSesion.classList.add('hidden');
      if (menuSesion) menuSesion.classList.add('hidden');
    }
  });


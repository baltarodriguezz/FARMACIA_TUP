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

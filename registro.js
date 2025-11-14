// registro.js
const API_BASE_URL = "https://localhost:7028";

document.addEventListener("DOMContentLoaded", () => {
  // ---------- OFFCANVAS ----------
  const menuOffcanvas = document.getElementById("menuOffcanvas");
  const btnAbrir      = document.getElementById("btnAbrir");
  const btnCerrar     = document.getElementById("btnCerrar");

  function abrirOffcanvas() {
    if (!menuOffcanvas) return;
    menuOffcanvas.classList.remove("translate-x-full");
  }

  function cerrarOffcanvas() {
    if (!menuOffcanvas) return;
    menuOffcanvas.classList.add("translate-x-full");
  }

  if (btnAbrir)  btnAbrir.addEventListener("click", abrirOffcanvas);
  if (btnCerrar) btnCerrar.addEventListener("click", cerrarOffcanvas);

  // ---------- MODAL LOGIN ----------
  const darkOverlay   = document.getElementById("darkOverlay");
  const loginModal    = document.getElementById("authentication-modal");
  const btnLogin      = document.getElementById("btnLogin");
  const btnCerrarLogin= document.getElementById("btnCerrarLogin");

  function mostrarOverlay() {
    if (!darkOverlay) return;
    darkOverlay.classList.remove("pointer-events-none");
    darkOverlay.classList.add("opacity-100");
  }

  function ocultarOverlay() {
    if (!darkOverlay) return;
    darkOverlay.classList.add("pointer-events-none");
    darkOverlay.classList.remove("opacity-100");
  }

  function abrirLogin() {
    if (!loginModal) return;
    loginModal.classList.remove("hidden", "opacity-0");
    loginModal.classList.add("flex");
    mostrarOverlay();
  }

  function cerrarLogin() {
    if (!loginModal) return;
    loginModal.classList.add("hidden");
    loginModal.classList.remove("flex");
    ocultarOverlay();
  }

  if (btnLogin)       btnLogin.addEventListener("click", abrirLogin);
  if (btnCerrarLogin) btnCerrarLogin.addEventListener("click", cerrarLogin);
  if (darkOverlay) {
    darkOverlay.addEventListener("click", () => {
      cerrarLogin();
      cerrarOffcanvas();
    });
  }

  // ---------- REGISTRO ----------
  const registerForm = document.getElementById("registerForm");
  const regNombre    = document.getElementById("regNombre");
  const regApellido  = document.getElementById("regApellido");
  const regCiudad    = document.getElementById("regCiudad");
  const regBarrio    = document.getElementById("regBarrio");
  const regCalle     = document.getElementById("regCalle");
  const regNumero    = document.getElementById("regNumero");
  const regEmail     = document.getElementById("regEmail");
  const regPassword  = document.getElementById("regPassword");
  const regTyC       = document.getElementById("regTyC");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!regTyC.checked) {
        alert("Tenés que aceptar los Términos y Condiciones para registrarte.");
        return;
      }

      const payload = {
        nombre:     regNombre.value.trim(),
        apellido:   regApellido.value.trim(),
        ciudad:     regCiudad.value.trim(),
        barrio:     regBarrio.value.trim(),
        calle:      regCalle.value.trim(),
        numero:     parseInt(regNumero.value, 10) || 0,
        email:      regEmail.value.trim(),
        contrasena: regPassword.value
      };

      // validación mínima
      if (!payload.nombre || !payload.apellido || !payload.email || !payload.contrasena) {
        alert("Completá todos los campos obligatorios.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/Clientes/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("Error al registrar:", res.status, text);
          alert(text || "No se pudo crear la cuenta. Revisá los datos.");
          return;
        }

        const data = await res.json();
        console.log("Registrado:", data);
        alert("Cuenta creada correctamente ✅. Ahora podés iniciar sesión.");

        // opcional: redirigir al home o a la página de login
        window.location.href = "index.html";
      } catch (err) {
        console.error("Error de red en registro:", err);
        alert("Hubo un problema de conexión al registrar.");
      }
    });
  }
});

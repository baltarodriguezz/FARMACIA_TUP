// --- Función helper para crear cards ---
function crearCardDermo(s) {
  const precio = (s.precioUnitario).toLocaleString("es-AR");
  const img = s.urlImagen && s.urlImagen.startsWith("http")
    ? s.urlImagen
    : `../assets/img/${s.urlImagen || "default.jpg"}`;

  // 1. Crear el elemento
  const cardEl = document.createElement('div');
  cardEl.className = "snap-start w-64 bg-white border border-gray-200 rounded-xl shadow p-5 flex-shrink-0 hover:shadow-xl transition h-47 flex flex-col";

  // 2. Definir su HTML (sin onclick)
  cardEl.innerHTML = `
    <div class="flex-1">
      <img src="${img}" class="w-40 h-40 object-contain mx-auto mb-3">
      <h3 class="font-semibold text-lg mb-1">${s.descripcion}</h3>
      <p class="text-sm text-gray-500 mb-2">${s.codBarra || ""}</p>
    </div>
    <div class="mt-auto">
      <p class="text-xl font-bold text-[#275c74] mb-4">$${precio}</p>
      <button class="btn-agregar border border-[#12b1be] text-[#12b1be] hover:bg-[#12b1be] hover:text-white rounded-lg w-full py-2 font-medium transition">
        Agregar al Carrito
      </button>
    </div>
  `;

  // 3. Buscar el botón y añadir el listener
  cardEl.querySelector('.btn-agregar').addEventListener('click', () => {
    agregarAlCarrito(s.idSuministro, s.precioUnitario);
  });

  // 4. Devolver el elemento listo
  return cardEl;
}

// --- Función principal ---
async function cargarDermocosmetica() {
  const endpoint = "https://localhost:7028/api/Suministros/tipo/3";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Error al cargar dermocosmética");

    const productos = await response.json();

    const serums = document.getElementById("contenedor-serums");
    const cremas = document.getElementById("contenedor-cremas");
    const protectores = document.getElementById("contenedor-protectores");

    if (!serums || !cremas || !protectores) return;

    serums.innerHTML = "";
    cremas.innerHTML = "";
    protectores.innerHTML = "";

    productos.forEach(s => {
      // Usamos la función helper para crear la card
      const cardElement = crearCardDermo(s);
      const nombre = s.descripcion.toLowerCase();

      // Clasificamos y usamos appendChild
      if (nombre.includes("serum") || nombre.includes("sérum") || nombre.includes("vitamina") || nombre.includes("minéral")) {
        serums.appendChild(cardElement);
      } else if (nombre.includes("protector") || nombre.includes("fps") || nombre.includes("solar")) {
        protectores.appendChild(cardElement);
      } else {
        cremas.appendChild(cardElement);
      }
    });

  } catch (err) {
    console.error("ERROR DERMOCOSMETICA:", err);
  }
}

document.addEventListener("DOMContentLoaded", cargarDermocosmetica);
async function cargarMedicamentos() {
  const endpoint = "https://localhost:7028/api/Suministros/tipo/1";
  const contenedor = document.getElementById("grid-medicamentos");
  if (!contenedor) return;

  contenedor.innerHTML = ""; // Limpiar

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Error al cargar medicamentos");

    const productos = await response.json();

    productos.forEach(s => {
      const precio = (s.precioUnitario).toLocaleString("es-AR");
      const img = s.urlImagen && s.urlImagen.startsWith("http")
        ? s.urlImagen
        : `../assets/img/${s.urlImagen || "default.jpg"}`;

      // 1. Crear el elemento
      const card = document.createElement("div");
      card.className = "bg-white border border-gray-200 rounded-xl shadow p-5 hover:shadow-xl transition h-full flex flex-col";

      // 2. Definir su HTML (sin onclick)
      card.innerHTML = `
        <div class="flex-1">
          <img src="${img}" class="w-40 h-40 mx-auto object-contain mb-4">
          <h3 class="font-semibold text-lg mb-1">${s.descripcion}</h3>
          <p class="text-sm text-gray-500 mb-2">Cod: ${s.codBarra}</p>
        </div>
        <div class="mt-auto">
          <p class="text-xl font-bold text-[#275c74] mb-4">$${precio}</p>
          <button class="btn-agregar border border-[#12b1be] text-[#12b1be] hover:bg-[#12b1be] hover:text-white transition rounded-lg w-full py-2">
            Agregar al Carrito
          </button>
        </div>
      `;

      // 3. Buscar el botón y añadir el listener
      card.querySelector('.btn-agregar').addEventListener('click', () => {
        // Llamamos a la función global de index.js
        agregarAlCarrito(s.idSuministro, s.precioUnitario);
      });

      // 4. Añadir la card al DOM
      contenedor.appendChild(card);
    });

  } catch (err) {
    console.error("ERROR API MEDICAMENTOS:", err);
  }
}

document.addEventListener("DOMContentLoaded", cargarMedicamentos);
const endpointBebes = "https://localhost:7028/api/Suministros/tipo/5";

async function cargarBebes() {
  try {
    const resp = await fetch(endpointBebes);
    if (!resp.ok) throw new Error("Error al cargar productos para bebés");

    const productos = await resp.json();
    console.log("PRODUCTOS BEBÉS:", productos);

    cargarCarrusel1(productos);
    cargarMedPediatrica(productos);
    cargarCarrusel3(productos);

  } catch (e) {
    console.error("ERROR BEBÉS:", e);
  }
}

function cargarCarrusel1(productos) {
  const cont = document.getElementById("carrusel-bebes-1");
  if (!cont) return;
  cont.innerHTML = "";
  productos.slice(0, 4).forEach(p => {
    cont.appendChild(crearCardCarrusel(p)); // Usamos appendChild
  });
}

function cargarMedPediatrica(productos) {
  const cont = document.getElementById("grilla-bebes-2");
  if (!cont) return;
  cont.innerHTML = "";
  productos.slice(4, 7).forEach(p => {
    cont.appendChild(crearCardGrilla(p)); // Usamos appendChild
  });
}

function cargarCarrusel3(productos) {
  const cont = document.getElementById("carrusel-bebes-3");
  if (!cont) return;
  cont.innerHTML = "";
  productos.slice(7, 10).forEach(p => {
    cont.appendChild(crearCardCarrusel(p)); // Usamos appendChild
  });
}

// --- TEMPLATES DE CARDS (CORREGIDOS) ---

function crearCardCarrusel(p) {
  const img = p.urlImagen && p.urlImagen.startsWith("http")
    ? p.urlImagen
    : `../assets/img/${p.urlImagen || "default.jpg"}`;

  const cardEl = document.createElement('div');
  cardEl.className = "snap-start bg-white border border-white/60 rounded-2xl shadow-xl flex-shrink-0 w-64 p-5 hover:shadow-2xl hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col";

  cardEl.innerHTML = `
    <div class="flex-1">
      <img src="${img}" class="w-36 h-36 object-contain mx-auto mb-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-1">${p.descripcion}</h3>
      <p class="text-sm text-gray-500 mb-2">${p.codBarra}</p>
    </div>
    <div class="mt-auto">
      <p class="text-xl font-bold text-[#275c74] mb-3">$${p.precioUnitario.toLocaleString("es-AR")}</p>
      <button class="btn-agregar border border-[#12b1be] text-[#12b1be] hover:bg-[#12b1be] hover:text-white rounded-lg w-full py-2 font-medium transition">
        Agregar al Carrito
      </button>
    </div>
  `;

  cardEl.querySelector('.btn-agregar').addEventListener('click', () => {
    agregarAlCarrito(p.idSuministro, p.precioUnitario);
  });

  return cardEl;
}

function crearCardGrilla(p) {
  const img = p.urlImagen && p.urlImagen.startsWith("http")
    ? p.urlImagen
    : `../assets/img/${p.urlImagen || "default.jpg"}`;

  const cardEl = document.createElement('div');
  cardEl.className = "bg-white rounded-2xl w-80 p-6 flex flex-col items-center text-center shadow-xl hover:shadow-2xl hover:shadow-black/20 hover:scale-[1.02] transition-all duration-500 ease-out h-47 flex flex-col";

  cardEl.innerHTML = `
    <div class="flex-1 flex flex-col items-center">
      <div class="w-32 h-32 mb-4">
        <img src="${img}" class="w-full h-full object-contain">
      </div>
      <h2 class="text-lg font-bold text-gray-800 mb-1">${p.descripcion}</h2>
      <p class="text-sm text-gray-500">${p.codBarra}</p>
    </div>
    <div class="mt-auto w-full">
      <p class="text-lg font-bold text-[#275c74] mb-3">$${p.precioUnitario.toLocaleString("es-AR")}</p>
      <button class="btn-agregar border border-[#12b1be] text-[#12b1be] hover:bg-[#12b1be] hover:text-white rounded-lg w-full py-2 font-medium transition">
        Añadir al carrito
      </button>
    </div>
  `;

  cardEl.querySelector('.btn-agregar').addEventListener('click', () => {
    agregarAlCarrito(p.idSuministro, p.precioUnitario);
  });

  return cardEl;
}

// INICIALIZAR
document.addEventListener("DOMContentLoaded", cargarBebes);
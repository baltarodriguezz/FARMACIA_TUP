const endpointBebes = "https://localhost:7028/api/Suministros/tipo/5";

async function cargarBebes() {
    try {
        const resp = await fetch(endpointBebes);
        const productos = await resp.json();

        console.log("PRODUCTOS BEBÉS:", productos);

        cargarCarrusel1(productos);
        cargarMedPediatrica(productos);
        cargarCarrusel3(productos);

    } catch (e) {
        console.error("ERROR BEBÉS:", e);
    }
}


// ---------------------- SECCIÓN 1 — CARRUSEL ----------------------
function cargarCarrusel1(productos) {
    const cont = document.getElementById("carrusel-bebes-1");
    if (!cont) return;

    cont.innerHTML = "";

    productos.slice(0, 4).forEach(p => {
        cont.innerHTML += crearCardCarrusel(p);
    });
}


// ---------------------- SECCIÓN 2 — GRILLA MEDICACIÓN ----------------------
function cargarMedPediatrica(productos) {
    const cont = document.getElementById("grilla-bebes-2");
    if (!cont) return;

    cont.innerHTML = "";

    productos.slice(4, 7).forEach(p => {
        cont.innerHTML += crearCardGrilla(p);
    });
}


// ---------------------- SECCIÓN 3 — CARRUSEL 2 ----------------------
function cargarCarrusel3(productos) {
    const cont = document.getElementById("carrusel-bebes-3");
    if (!cont) return;

    cont.innerHTML = "";

    productos.slice(7, 10).forEach(p => {
        cont.innerHTML += crearCardCarrusel(p);
    });
}


// ---------------------- TEMPLATES DE CARDS ----------------------
function crearCardCarrusel(p) {
    return `
        <div class="snap-start bg-white border border-white/60 rounded-2xl shadow-xl flex-shrink-0 w-64 p-5 hover:shadow-2xl hover:shadow-black/20 hover:scale-[1.03] transition-all duration-500 ease-out">
            <img src="../assets/img/${p.urlImagen || "default.jpg"}"
                 class="w-36 h-36 object-contain mx-auto mb-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-1">${p.descripcion}</h3>
            <p class="text-sm text-gray-500 mb-2">${p.codBarra}</p>
            <p class="text-xl font-bold text-[#275c74] mb-3">$${p.precioUnitario.toLocaleString("es-AR")}</p>
            <button class="bg-[#12b1be] hover:bg-[#0e9ca9] text-white font-medium w-full py-2 rounded-lg text-sm transition-colors duration-300">
                Agregar al carrito
            </button>
        </div>
    `;
}

function crearCardGrilla(p) {
    return `
        <div class="bg-white rounded-2xl w-80 p-6 flex flex-col items-center text-center shadow-xl hover:shadow-2xl hover:shadow-black/20 hover:scale-[1.02] transition-all duration-500 ease-out">
            <div class="w-32 h-32 mb-4">
              <img src="../assets/img/${p.urlImagen || "default.jpg"}"
                   class="w-full h-full object-contain">
            </div>

            <h2 class="text-lg font-bold text-gray-800 mb-1">${p.descripcion}</h2>
            <p class="text-sm text-gray-500">${p.codBarra}</p>

            <p class="text-lg font-bold text-[#275c74] mb-3">$${p.precioUnitario.toLocaleString("es-AR")}</p>

            <button class="bg-[#12b1be] hover:bg-[#0e9ca9] text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-300">
              Añadir al carrito
            </button>
        </div>
    `;
}


// INICIALIZAR
document.addEventListener("DOMContentLoaded", cargarBebes);

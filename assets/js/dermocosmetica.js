async function cargarDermocosmetica() {

    const endpoint = "https://localhost:7029/api/Suministro/tipo/3";

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Error al cargar dermocosmética");

        const productos = await response.json();

        // Contenedores por sección
        const serums = document.getElementById("contenedor-serums");
        const cremas = document.getElementById("contenedor-cremas");
        const protectores = document.getElementById("contenedor-protectores");

        // Limpio contenido
        serums.innerHTML = "";
        cremas.innerHTML = "";
        protectores.innerHTML = "";

        productos.forEach(s => {

            const precio = (s.precioUnitario).toLocaleString("es-AR");
            const img = s.urlImagen ? `../assets/img/${s.urlImagen}` : "../assets/img/default.jpg";

            const card = `
                <div class="snap-start w-64 bg-white border border-gray-200 rounded-xl shadow p-5 flex-shrink-0 hover:shadow-xl transition">
                    <img src="${img}" class="w-40 h-40 object-contain mx-auto mb-3">
                    <h3 class="font-semibold text-lg mb-1">${s.descripcion}</h3>
                    <p class="text-sm text-gray-500 mb-2">${s.codBarra || ""}</p>
                    <p class="text-xl font-bold text-[#275c74] mb-4">$${precio}</p>
                    <button class="border border-[#12b1be] text-[#12b1be] hover:bg-[#12b1be] hover:text-white rounded-lg w-full py-2 font-medium transition">
                        Agregar
                    </button>
                </div>
            `;

            // CLASIFICACIÓN PROFESIONAL
            const nombre = s.descripcion.toLowerCase();

            if (nombre.includes("serum") || nombre.includes("sérum") || nombre.includes("vitamina") || nombre.includes("minéral")) {
                serums.innerHTML += card;
            } 
            else if (nombre.includes("protector") || nombre.includes("fps") || nombre.includes("solar")) {
                protectores.innerHTML += card;
            } 
            else {
                // Todo lo demás → CREMAS (incluye limpiador Effaclar)
                cremas.innerHTML += card;
            }
        });

    } catch (err) {
        console.error("ERROR DERMOCOSMETICA:", err);
    }
}

document.addEventListener("DOMContentLoaded", cargarDermocosmetica);

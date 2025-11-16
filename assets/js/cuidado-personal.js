async function cargarCuidadoPersonal() {

    const endpoint = "https://localhost:7028/api/Suministros/tipo/4";

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Error al cargar productos de cuidado personal");

        const productos = await response.json();

        // Contenedores
        const facial = document.getElementById("contenedor-facial");
        const corporal = document.getElementById("contenedor-corporal");
        const ocular = document.getElementById("contenedor-ocular");
        const capilar = document.getElementById("contenedor-capilar");

        facial.innerHTML = "";
        corporal.innerHTML = "";
        ocular.innerHTML = "";
        capilar.innerHTML = "";

        productos.forEach(s => {

            const precio = (s.precioUnitario).toLocaleString("es-AR");
            const img = s.urlImagen && s.urlImagen.startsWith("http")
                ? s.urlImagen
                : `../assets/img/${s.urlImagen || "default.jpg"}`;
            const nombre = s.descripcion.toLowerCase();

            // ✅ REEMPLAZAR ESTA VARIABLE
            const card = `
                <div class="snap-start w-64 bg-white border border-gray-200 rounded-xl shadow p-5 flex-shrink-0 hover:shadow-xl transition h-47 flex flex-col">
                    
                    <div class="flex-1">
                        <img src="${img}" class="w-40 h-40 object-contain mx-auto mb-3">
                        <h3 class="font-semibold text-lg mb-1">${s.descripcion}</h3>
                        <p class="text-sm text-gray-500 mb-2">${s.codBarra || ""}</p>
                    </div>

                    <div class="mt-auto">
                        <p class="text-xl font-bold text-[#275c74] mb-4">$${precio}</p>
                        <button class="border border-[#12b1be] text-[#12b1be] hover:bg-[#12b1be] hover:text-white rounded-lg w-full py-2 font-medium transition">
                            Agregar al Carrito
                        </button>
                    </div>
                </div>
            `;


            // ===========================
            // CLASIFICACIÓN
            // ===========================

            // CORPOREAL
            if (
                nombre.includes("desodorante") ||
                nombre.includes("antitranspirante") ||
                nombre.includes("corporal") ||
                nombre.includes("body") ||
                nombre.includes("jabón") ||
                nombre.includes("jabon") ||
                nombre.includes("gel") ||
                nombre.includes("loción corporal") ||
                nombre.includes("crema corporal") ||
                nombre.includes("baño")
            ) {
                corporal.innerHTML += card;
                return;
            }

            // OCULAR
            if (
                nombre.includes("ocular") ||
                nombre.includes("ojos") ||
                nombre.includes("lágrima") ||
                nombre.includes("lagrima") ||
                nombre.includes("gotas") ||
                nombre.includes("solución") ||
                nombre.includes("solucion")
            ) {
                ocular.innerHTML += card;
                return;
            }

            // CAPILAR
            if (
                nombre.includes("shampoo") ||
                nombre.includes("champu") ||
                nombre.includes("acondicionador") ||
                nombre.includes("capilar") ||
                nombre.includes("mascarilla capilar") ||
                nombre.includes("ampolla")
            ) {
                capilar.innerHTML += card;
                return;
            }

            // FACIAL
            if (
                nombre.includes("facial") ||
                nombre.includes("rostro") ||
                nombre.includes("cara") ||
                nombre.includes("serum") ||
                nombre.includes("sérum") ||
                nombre.includes("crema") ||
                nombre.includes("antiage") ||
                nombre.includes("anti-edad") ||
                nombre.includes("mascarilla")
            ) {
                facial.innerHTML += card;
                return;
            }

            // SI NO COINCIDE → FACIAL
            facial.innerHTML += card;
        });

    } catch (err) {
        console.error("ERROR CUIDADO PERSONAL:", err);
    }
}

document.addEventListener("DOMContentLoaded", cargarCuidadoPersonal);

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
            const img = s.urlImagen ? `../assets/img/${s.urlImagen}` : "../assets/img/default.jpg";
            const nombre = s.descripcion.toLowerCase();

            const card = `
                <div class="snap-start bg-white rounded-xl shadow p-4 w-72 hover:shadow-md transition">
                    <img src="${img}" class="w-48 h-48 object-contain mx-auto mb-4">

                    <h3 class="font-semibold text-gray-800">${s.descripcion}</h3>

                    <p class="text-gray-500 text-sm">${s.codBarra || ""}</p>

                    <p class="text-xl font-bold text-[#275c74] mt-2">$${precio}</p>

                    <button class="border border-[#12b1be] text-[#12b1be] 
                                   hover:bg-[#12b1be] hover:text-white 
                                   w-full py-2 rounded-lg mt-3 transition">
                        Agregar
                    </button>
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

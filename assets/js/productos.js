async function cargarMedicamentos() {

    // ✅ CORREGIDO: URL correcta
    const endpoint = "https://localhost:7028/api/Suministros/tipo/1";

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Error al cargar medicamentos");

        const productos = await response.json();
        console.log("PRODUCTOS MEDICAMENTOS:", productos);

        const contenedor = document.getElementById("grid-medicamentos");
        contenedor.innerHTML = "";

        productos.forEach(s => {

            const precio = (s.precioUnitario).toLocaleString("es-AR");
            
            // Lógica de imagen (usa nombre de archivo, no URL completa)
            const img = s.urlImagen ? `../assets/img/${s.urlImagen}` : "../assets/img/default.jpg";

            const card = document.createElement("div");
            // ✅ REEMPLAZAR ESTAS LÍNEAS
            card.className =
                "bg-white border border-gray-200 rounded-xl shadow p-5 hover:shadow-xl transition h-full flex flex-col";

            card.innerHTML = `
                <div class="flex-1">
                    <img src="${img}"
                        class="w-40 h-40 mx-auto object-contain mb-4">
                    <h3 class="font-semibold text-lg mb-1">${s.descripcion}</h3>
                    <p class="text-sm text-gray-500 mb-2">Cod: ${s.codBarra}</p>
                </div>

                <div class="mt-auto">
                    <p class="text-xl font-bold text-[#275c74] mb-4">$${precio}</p>
                    <button class="border border-[#12b1be] text-[#12b1be]
                                    hover:bg-[#12b1be] hover:text-white transition
                                    rounded-lg w-full py-2">
                        Agregar
                    </button>
                </div>
            `;
            contenedor.appendChild(card);
        });

    } catch (err) {
        console.error("ERROR API MEDICAMENTOS:", err);
    }
}

document.addEventListener("DOMContentLoaded", cargarMedicamentos);
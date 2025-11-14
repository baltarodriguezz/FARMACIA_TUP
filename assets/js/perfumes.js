async function cargarPerfumes() {

    const endpoint = "https://localhost:7029/api/Suministro/tipo/2";

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Error al cargar perfumes");

        const perfumes = await response.json();

        console.log("PERFUMES RECIBIDOS:", perfumes);

        const lista = document.getElementById("listaPerfumes");
        lista.innerHTML = "";

        perfumes.forEach(p => {

            // Precio formateado
            const precio = p.precioUnitario.toLocaleString("es-AR");

            // URL imagen (usa default si no existe)
            const imagen = `../assets/img/${p.urlImagen || "default.jpg"}`;

            const card = document.createElement("div");
            card.className =
                "snap-start bg-white border border-gray-200 rounded-xl shadow-sm flex-shrink-0 w-64 p-5 hover:shadow-xl transition h-auto";

            card.innerHTML = `
                <img src="${imagen}" class="w-44 h-44 object-contain mx-auto mb-4">
                <h3 class="text-lg font-semibold text-gray-800">${p.descripcion}</h3>
                <p class="text-sm text-gray-500">Cod: ${p.codBarra}</p>
                <p class="text-xl font-bold text-[#275c74] mt-2">$${precio}</p>

                <button class="border border-[#12b1be] text-[#12b1be]
                    hover:bg-[#12b1be] hover:text-white w-full py-2 rounded-lg transition">
                    Agregar
                </button>
            `;

            lista.appendChild(card);
        });

    } catch (err) {
        console.error("ERROR PERFUMES:", err);
    }
}

document.addEventListener("DOMContentLoaded", cargarPerfumes);

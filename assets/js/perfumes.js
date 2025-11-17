async function cargarPerfumes() {

    const endpoint = "https://localhost:7028/api/Suministros/tipo/2";

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Error al cargar perfumes");

        const perfumes = await response.json();
        const lista = document.getElementById("listaPerfumes");
        lista.innerHTML = "";

        perfumes.forEach(p => {
            const precio = p.precioUnitario.toLocaleString("es-AR");
            const imagen = p.urlImagen || "../assets/img/default.jpg";

            const card = document.createElement("div");
            card.className =
                "snap-start bg-white border border-gray-200 rounded-xl shadow-sm flex-shrink-0 w-64 p-5 hover:shadow-xl transition h-47 flex flex-col";

            // 1. HTML sin el "onclick"
            card.innerHTML = `
                <div class="flex-1">
                    <img src="${imagen}" class="w-44 h-44 object-contain mx-auto mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">${p.descripcion}</h3>
                    <p class="text-sm text-gray-500">Cod: ${p.codBarra}</p>
                </div>
                <div class="mt-auto">
                    <p class="text-xl font-bold text-[#275c74] mb-3">$${precio}</p>

                    <button class="btn-agregar border border-[#12b1be] text-[#12b1be]
                        hover:bg-[#12b1be] hover:text-white w-full py-2 rounded-lg transition">
                        Agregar al Carrito
                    </button>
                </div>
            `;

            // 2. Buscar el botón dentro de la card que acabamos de crear
            const botonAgregar = card.querySelector(".btn-agregar");

            // 3. Asignar el listener de forma limpia
            //    (Esto funciona porque agregarAlCarrito() está en index.js,
            //     que se carga en el scope global)
            botonAgregar.addEventListener("click", () => {
                agregarAlCarrito(p.idSuministro, p.precioUnitario);
            });

            lista.appendChild(card);
        });

    } catch (err) {
        console.error("ERROR PERFUMES:", err);
    }
}

document.addEventListener("DOMContentLoaded", cargarPerfumes);
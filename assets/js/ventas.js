const API = "https://localhost:7028/api/";

async function apiGet(url) {
    const res = await fetch(API + url);
    return await res.json();
}

const tabla = document.getElementById("tablaVentas");
const modal = document.getElementById("modal");
const detalleContenido = document.getElementById("detalleContenido");
document.getElementById("cerrarModal").onclick = () => modal.classList.add("hidden");

// ---------------- CARGAR CLIENTES ----------------
async function cargarClientesSelect() {
    const clientes = await apiGet("Clientes");

    const select = document.getElementById("filtroCliente");
    select.innerHTML = `<option value="">Seleccionar cliente</option>`;

    clientes.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.idCliente; 
        opt.textContent = c.nombreCompleto;
        select.appendChild(opt);
    });
}

// ---------------- RENDER TABLA ----------------
function renderTabla(lista) {
    tabla.innerHTML = "";

    lista.forEach(v => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="p-3">${v.idFactura}</td>
            <td class="p-3">${v.idCliente}</td>
            <td class="p-3">${v.fechaEmision.split("T")[0]}</td>
            <td class="p-3 text-[#12b1be] font-semibold">$${v.total}</td>
            <td class="p-3">
                <button class="text-blue-600 hover:underline" onclick="verDetalle(${v.idFactura})">
                    Ver detalle
                </button>
            </td>
        `;
        tabla.appendChild(tr);
    });
}

// ---------------- VER DETALLE ----------------
async function verDetalle(id) {
    const factura = await apiGet(`Factura/${id}`);

    let html = `
        <p><strong>Cliente:</strong> ${factura.idCliente}</p>
        <p><strong>Fecha:</strong> ${factura.fechaEmision.split("T")[0]}</p>
        <p><strong>Total:</strong> $${factura.total}</p>

        <h3 class="mt-4 text-xl font-semibold">Productos:</h3>
        <table class="min-w-full mt-2 border">
            <thead class="bg-gray-200">
                <tr>
                    <th class="p-2">ID Suministro</th>
                    <th class="p-2">Cantidad</th>
                    <th class="p-2">Precio Unitario</th>
                    <th class="p-2">Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;

    factura.detalles.forEach(d => {
        html += `
            <tr class="border-t">
                <td class="p-2">${d.idSuministro}</td>
                <td class="p-2">${d.cantidad}</td>
                <td class="p-2">$${d.precioUnitario}</td>
                <td class="p-2">$${d.cantidad * d.precioUnitario}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;

    detalleContenido.innerHTML = html;
    modal.classList.remove("hidden");
}

// ---------------- BOTONES ----------------

// Todas las ventas
document.getElementById("btnTodas").onclick = async () => {
    renderTabla(await apiGet("Factura"));
};

// Filtrar por cliente
document.getElementById("btnFiltrarCliente").onclick = async () => {
    const id = document.getElementById("filtroCliente").value;
    if (!id) return alert("Seleccioná un cliente.");

    renderTabla(await apiGet(`Factura/FacturaPorCliente/${id}`));
};

// Filtrar por fechas
document.getElementById("btnFiltrarFecha").onclick = async () => {
    const inicio = document.getElementById("fechaInicio").value;
    const fin = document.getElementById("fechaFin").value;

    if (!inicio || !fin) {
        alert("Seleccioná ambas fechas.");
        return;
    }

    renderTabla(
        await apiGet(`Factura/entre-fecha?fechaInicio=${inicio}&fechaFin=${fin}`)
    );
};

// Actualizar recaudación total
document.getElementById("btnRecaudacion").onclick = async () => {
    const total = await apiGet("Factura/RecaudacionTotal");
    alert(`Recaudación total: $${total}`);
};

// ---------------- LOAD INIT ----------------
(async () => {
    await cargarClientesSelect();
    renderTabla(await apiGet("Factura"));
})();

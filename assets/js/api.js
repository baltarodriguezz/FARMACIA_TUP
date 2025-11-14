const API_URL = "https://localhost:7028/api"; // AJUSTA TU PUERTO

async function apiGet(ruta) {
    const resp = await fetch(`${API_URL}/${ruta}`);
    if (!resp.ok) throw new Error("Error GET: " + resp.status);
    return await resp.json();
}

async function apiPost(ruta, data) {
    const resp = await fetch(`${API_URL}/${ruta}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!resp.ok) throw new Error("Error POST: " + resp.status);
    return await resp.json();
}

async function apiPut(ruta, data) {
    const resp = await fetch(`${API_URL}/${ruta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!resp.ok) throw new Error("Error PUT: " + resp.status);
    return await resp.json();
}

async function apiDelete(ruta) {
    const resp = await fetch(`${API_URL}/${ruta}`, { method: "DELETE" });
    if (!resp.ok) throw new Error("Error DELETE: " + resp.status);
}

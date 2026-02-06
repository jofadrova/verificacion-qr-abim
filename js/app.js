// ===============================
// CONFIGURACIÓN
// ===============================

// URL de la Edge Function (NO Supabase REST)
const EDGE_FUNCTION_URL =
  "https://robjczsumjidmhfsacua.functions.supabase.co/verificar_asociado";

// ===============================
// LECTURA DE PARÁMETROS
// ===============================

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const contenedor = document.getElementById("resultado");

if (!id) {
  contenedor.innerHTML =
    "<p class='error'>ID NO PROPORCIONADO</p>";
  throw new Error("ID faltante");
}

// ===============================
// CONSULTA A EDGE FUNCTION
// ===============================

fetch(`${EDGE_FUNCTION_URL}?id=${encodeURIComponent(id)}`)
  .then(res => res.json())
  .then(data => {

    // 1️⃣ Limpiar clases de semáforo
    contenedor.classList.remove("verde", "amarillo", "rojo");

    // 2️⃣ Aplicar color enviado por backend
    if (data.color) {
      contenedor.classList.add(data.color);
    }

    // 3️⃣ Construir HTML base (mensaje oficial)
    let html = `
      <h2 class="titulo">${data.mensaje}</h2>
    `;

    // 4️⃣ Si hay datos del asociado, mostrarlos
    if (data.asociado) {
      html += `
        <img
          src="${data.asociado.foto}"
          alt="Foto del asociado"
          style="width:120px; border-radius:8px; margin:10px auto; display:block;"
        />

        <p><b>Grado:</b> ${data.asociado.grado}</p>
        <p><b>Nombre:</b> ${data.asociado.nombres} ${data.asociado.apellidos}</p>
        <p><b>Fuerza:</b> ${data.asociado.fuerza}</p>
      `;
    }

    // 5️⃣ Pintar resultado final
    contenedor.innerHTML = html;
  })
  .catch(err => {
    console.error(err);
    contenedor.classList.remove("verde", "amarillo");
    contenedor.classList.add("rojo");
    contenedor.innerHTML =
      "<h2 class='error'>ERROR DE VERIFICACIÓN</h2>";
  });

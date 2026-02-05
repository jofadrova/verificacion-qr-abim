const SUPABASE_URL = "https://robjczsumjidmhfsacua.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYmpjenN1bWppZG1oZnNhY3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjI3MjEsImV4cCI6MjA4NTc5ODcyMX0.IfU2olTfkQ2KrepGomFX_-GTL6s_YLMRDwgNh_wpMVg";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const contenedor = document.getElementById("resultado");

if (!id) {
  contenedor.innerHTML = "<p class='error'>ID no proporcionado</p>";
  throw new Error("ID faltante");
}

fetch(`${SUPABASE_URL}/rest/v1/asociados?id=eq.${id}`, {
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    Accept: "application/json"
  }
})
.then(res => res.json())
.then(data => {
  if (!data.length) {
    contenedor.innerHTML = "<p class='error'>Asociado no encontrado</p>";
    return;
  }

  const a = data[0];

  // 1️⃣ Construimos HTML
  contenedor.innerHTML = `
    <h2 class="ok">✔ Credencial válida</h2>

    <img id="fotoAsociado"
         alt="Foto del asociado"
         style="display:none; width:120px; border-radius:8px; margin-bottom:10px;" />

    <p><b>Nombre:</b> ${a.nombres} ${a.apellidos}</p>
    <p><b>CI:</b> ${a.ci}</p>
    <p><b>Grado:</b> ${a.grado}</p>
    <p><b>Fuerza:</b> ${a.fuerza}</p>
    <p><b>Vigencia:</b> ${a.vigencia}</p>
    <p><b>Estado:</b> ${a.estado}</p>
  `;

  // 2️⃣ Ahora sí asignamos la imagen
  const fotoImg = document.getElementById("fotoAsociado");

  if (a.foto_asociado_url && a.foto_asociado_url.startsWith("http")) {
    fotoImg.src = a.foto_asociado_url;
    fotoImg.style.display = "block";
  }
})
.catch(err => {
  contenedor.innerHTML = "<p class='error'>Error al consultar</p>";
  console.error(err);
});

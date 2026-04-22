document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorMensajes");
    const inputMensaje = document.getElementById("nuevoMensaje");
    const btnEnviar = document.getElementById("btnEnviar");
    
    // 1. Obtener contexto: Usuario y Curso
    const usuarioActivo = JSON.parse(localStorage.getItem("usuario_activo"));
    const claveCurso = localStorage.getItem("curso_actual_estudiante");
    const todosLosCursos = JSON.parse(localStorage.getItem("cursos_docente")) || [];
    const curso = todosLosCursos.find(c => c.clave === claveCurso);

    if (curso) {
        document.getElementById("nombreMateriaForo").textContent = curso.nombre;
    }

    // 2. Función para cargar mensajes (Simulando db.mensajes.find({ curso: claveCurso }))
    const cargarMensajes = () => {
        const todosLosMensajes = JSON.parse(localStorage.getItem("mensajes_foro")) || [];
        // Filtramos para ver solo mensajes de este curso
        const mensajesCurso = todosLosMensajes.filter(m => m.cursoClave === claveCurso);

        contenedor.innerHTML = "";

        if (mensajesCurso.length === 0) {
            contenedor.innerHTML = `<p style="text-align:center; color:#999; margin-top:20px;">No hay mensajes aún. ¡Sé el primero en preguntar!</p>`;
        }

        // Dentro de la función cargarMensajes
mensajesCurso.forEach(msg => {
    const esMio = msg.usuario === usuarioActivo.username;
    const esDocente = msg.rol === "Docente"; // Detecta si el mensaje es de un profesor

    const burbuja = document.createElement("div");
    burbuja.style.display = "flex";
    burbuja.style.flexDirection = "column";
    burbuja.style.alignItems = esMio ? "flex-end" : "flex-start";
    burbuja.style.marginBottom = "15px";

    // Si es docente, le ponemos un borde o color especial
    const estiloDocente = esDocente ? "border: 2px solid #a37d2d;" : "border: 1px solid #ddd;";
    const fondo = esMio ? "#365652" : (esDocente ? "#fdf9f0" : "#fff");
    const colorTexto = esMio ? "#fff" : "#333";

    burbuja.innerHTML = `
        <div style="background: ${fondo}; color: ${colorTexto}; padding: 10px 15px; border-radius: 15px; max-width: 70%; ${estiloDocente} box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <small style="font-weight: bold; display: block; margin-bottom: 5px; color: #a37d2d;">
                ${msg.usuario} ${esDocente ? '👨‍🏫' : '👤'} (${msg.rol})
            </small>
            ${msg.texto}
            <small style="display: block; text-align: right; font-size: 0.7em; margin-top: 5px; opacity: 0.7;">
                ${msg.fecha}
            </small>
        </div>
    `;
    contenedor.appendChild(burbuja);
});
        
        // Auto-scroll al final
        contenedor.scrollTop = contenedor.scrollHeight;
    };

    // 3. Función para enviar (Simulando db.mensajes.insert())
    btnEnviar.addEventListener("click", () => {
        const texto = inputMensaje.value.trim();
        if (!texto) return;

        const nuevoMsg = {
            cursoClave: claveCurso,
            usuario: usuarioActivo.username,
            rol: usuarioActivo.rol,
            texto: texto,
            fecha: new Date().toLocaleString()
        };

        const todosLosMensajes = JSON.parse(localStorage.getItem("mensajes_foro")) || [];
        todosLosMensajes.push(nuevoMsg);
        localStorage.setItem("mensajes_foro", JSON.stringify(todosLosMensajes));

        inputMensaje.value = "";
        cargarMensajes();
    });

    cargarMensajes();
});
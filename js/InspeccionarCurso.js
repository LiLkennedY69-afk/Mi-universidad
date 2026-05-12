document.addEventListener("DOMContentLoaded", () => {
    const claveCurso = localStorage.getItem("curso_a_inspeccionar");
    const cursosGlobales = JSON.parse(localStorage.getItem("cursos_docente")) || [];
    const usuario = JSON.parse(localStorage.getItem("usuario_activo"));

    // Mostrar nombre del maestro en el header
    if (usuario && document.getElementById("teacher-name")) {
        document.getElementById("teacher-name").textContent = usuario.username || "Maestro";
    }

    // Buscar el curso en el arreglo
    const curso = cursosGlobales.find(c => c.clave === claveCurso);

    if (!curso) {
        alert("Curso no encontrado");
        window.location.href = "DocenteVerCursosBD.html";
        return;
    }

    // 1. Llenar información de cabecera
    document.getElementById("tituloCurso").textContent = `${curso.nombre} (Clave: ${curso.clave})`;
    document.getElementById("infoCurso").textContent = `Profesor: ${curso.docenteId} | Alumnos: ${(curso.estudiantes || []).length}`;

    // 2. Llenar Tabla de Tareas
    const tablaTareas = document.getElementById("tablaTareas");
    if(curso.tareas && curso.tareas.length > 0) {
        let htmlTareas = "";
        curso.tareas.forEach(tarea => {
            htmlTareas += `<tr>
                <td>${tarea.nombre}</td>
                <td>${tarea.vencimiento}</td>
                <td>${tarea.entregas || 0}/25</td>
                <td>${tarea.estado}</td>
            </tr>`;
        });
        tablaTareas.innerHTML = htmlTareas;
    } else {
        tablaTareas.innerHTML = "<tr><td colspan='4'>No hay tareas registradas</td></tr>";
    }

    // 3. Llenar Tabla de Materiales
    const tablaMateriales = document.getElementById("tablaMateriales");
    if(curso.materiales && curso.materiales.length > 0) {
        let htmlMat = "";
        curso.materiales.forEach(mat => {
            htmlMat += `<tr>
                <td>${mat.nombre}</td>
                <td>${mat.tipo}</td>
                <td><a href="#">Descargar</a></td>
                <td>Publicado</td>
            </tr>`;
        });
        tablaMateriales.innerHTML = htmlMat;
    } else {
        tablaMateriales.innerHTML = "<tr><td colspan='4'>No hay materiales</td></tr>";
    }

    // Configuración del botón Cerrar Sesión
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem("usuario_activo");
            window.location.href = "login.html"; // Ajusta a tu página de login
        };
    }
});

// Función para redirigir al Foro/Chat
function irAlForo() {
    const claveCurso = localStorage.getItem("curso_a_inspeccionar");
    if (claveCurso) {
        // Guardamos el contexto del foro actual
        localStorage.setItem("foro_actual", claveCurso);
        window.location.href = "Foro.html";
    } else {
        alert("No se pudo identificar el curso.");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const claveCurso = localStorage.getItem("curso_a_inspeccionar");
    const cursosGlobales = JSON.parse(localStorage.getItem("cursos_docente")) || [];
    
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

    // 2. Llenar Tabla de Tareas (Simulado con los datos del objeto)
    const tablaTareas = document.getElementById("tablaTareas");
    if(curso.tareas && curso.tareas.length > 0) {
        curso.tareas.forEach(tarea => {
            tablaTareas.innerHTML += `<tr>
                <td>${tarea.nombre}</td>
                <td>${tarea.vencimiento}</td>
                <td>${tarea.entregas || 0}/25</td>
                <td>${tarea.estado}</td>
            </tr>`;
        });
    } else {
        tablaTareas.innerHTML = "<tr><td colspan='4'>No hay tareas registradas</td></tr>";
    }

    // 3. Llenar Tabla de Materiales
    const tablaMateriales = document.getElementById("tablaMateriales");
    if(curso.materiales && curso.materiales.length > 0) {
        curso.materiales.forEach(mat => {
            tablaMateriales.innerHTML += `<tr>
                <td>${mat.nombre}</td>
                <td>${mat.tipo}</td>
                <td><a href="#">Descargar</a></td>
                <td>Publicado</td>
            </tr>`;
        });
    } else {
        tablaMateriales.innerHTML = "<tr><td colspan='4'>No hay materiales</td></tr>";
    }
});
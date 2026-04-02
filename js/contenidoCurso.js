document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener la clave del curso que el usuario seleccionó
    const claveCursoActual = localStorage.getItem("curso_actual_estudiante");
    const todosLosCursos = JSON.parse(localStorage.getItem("cursos_docente")) || [];

    // 2. Buscar los datos de ese curso específico
    const curso = todosLosCursos.find(c => c.clave === claveCursoActual);

    if (!curso) {
        Swal.fire('Error', 'No se pudo cargar la información del curso', 'error')
            .then(() => window.location.href = "homeEstudiante.html");
        return;
    }

    // 3. Llenar encabezados
    document.getElementById("nombreCursoCabecera").textContent = curso.nombre;
    document.getElementById("tituloCurso").textContent = curso.nombre;
    document.getElementById("claveCurso").textContent = `Clave: ${curso.clave}`;

    // 4. Renderizar Materiales
    const contenedorMateriales = document.getElementById("listaMateriales");
    if (curso.materiales && curso.materiales.length > 0) {
        contenedorMateriales.innerHTML = curso.materiales.map(mat => `
            <div class="item-dinamico">
                <span>Archivo: ${mat.titulo}</span>
                <button class="btn-submit" style="padding: 5px 10px; font-size: 0.8em;" onclick="descargarSimulado('${mat.titulo}')">Descargar</button>
            </div>
        `).join("");
    } else {
        contenedorMateriales.innerHTML = "<p>No hay materiales disponibles.</p>";
    }

    // 5. Renderizar Tareas
    const contenedorTareas = document.getElementById("listaTareas");
    if (curso.tareas && curso.tareas.length > 0) {
        contenedorTareas.innerHTML = curso.tareas.map(tar => `
            <div class="item-dinamico" style="border-left-color: #a37d2d;">
                <div>
                    <strong>${tar.titulo}</strong><br>
                    <small>Valor: ${tar.puntos} puntos</small>
                </div>
                <button class="btn-submit" style="padding: 5px 10px; font-size: 0.8em; background: #a37d2d;" onclick="entregarTarea('${tar.titulo}')">Entregar</button>
            </div>
        `).join("");
    } else {
        contenedorTareas.innerHTML = "<p>No hay tareas pendientes.</p>";
    }
});

// Funciones de interacción básica
function descargarSimulado(nombre) {
    Swal.fire('Descarga', `Iniciando descarga de: ${nombre}`, 'success');
}

function entregarTarea(nombre) {
    Swal.fire({
        title: 'Entregar Tarea',
        text: `¿Deseas subir tu archivo para: ${nombre}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#365652',
        confirmButtonText: 'Subir Archivo'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Entregado', 'Tu tarea ha sido enviada al docente.', 'success');
        }
    });
}
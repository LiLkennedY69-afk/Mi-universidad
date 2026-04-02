document.addEventListener("DOMContentLoaded", () => {
    const index = localStorage.getItem("curso_a_editar");
    let cursos = JSON.parse(localStorage.getItem("cursos_docente")) || [];
    let curso = cursos[index];
    
    // 1. OBTENER USUARIO ACTIVO PARA VALIDACIÓN
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));

    // Redirección de seguridad si no hay curso seleccionado o no hay usuario
    if (!curso || !activeUser) return window.location.href = "VerCursosDocente.html";

    // 2. VALIDACIÓN DE PROPIEDAD: Si el curso no le pertenece a este docente, lo sacamos
    if (curso.docenteId !== activeUser.username) {
        Swal.fire({
            title: "Acceso Denegado",
            text: "No tienes permiso para editar este curso.",
            icon: "error",
            confirmButtonColor: "#365652"
        }).then(() => {
            window.location.href = "VerCursosDocente.html";
        });
        return;
    }

    // Referencias a los elementos del DOM
    const inputNombre = document.getElementById("editNombre");
    const inputClave = document.getElementById("editClave");
    const listaAlumnos = document.getElementById("listaAlumnos");
    const listaMateriales = document.getElementById("listaMateriales");
    const listaTareas = document.getElementById("listaTareas");

    // Cargar datos actuales del curso en los inputs
    inputNombre.value = curso.nombre;
    inputClave.value = curso.clave || "";

    // --- FUNCIÓN PARA REDIBUJAR LAS LISTAS EN PANTALLA ---
    const actualizarVistas = () => {
        // Renderizado de Alumnos
        listaAlumnos.innerHTML = (curso.estudiantes || []).map((est, i) => `
            <div class="item-dinamico">
                <span>Alumno: ${est}</span>
                <button type="button" class="btn-delete-small" onclick="eliminarItem('estudiantes', ${i})">Eliminar</button>
            </div>
        `).join("");

        // Renderizado de Materiales
        listaMateriales.innerHTML = (curso.materiales || []).map((mat, i) => `
            <div class="item-dinamico">
                <span>Archivo: ${mat.titulo}</span>
                <button type="button" class="btn-delete-small" onclick="eliminarItem('materiales', ${i})">Eliminar</button>
            </div>
        `).join("");

        // Renderizado de Tareas
        if (listaTareas) {
            listaTareas.innerHTML = (curso.tareas || []).map((tar, i) => `
                <div class="item-dinamico">
                    <span>Tarea: ${tar.titulo} - Valor: ${tar.puntos} pts</span>
                    <button type="button" class="btn-delete-small" onclick="eliminarItem('tareas', ${i})">Eliminar</button>
                </div>
            `).join("");
        }
    };

    // --- LÓGICA PARA AGREGAR ALUMNOS (Corregida) ---
    window.agregarAlumno = () => {
        const input = document.getElementById("nuevoAlumno");
        const nombreBusqueda = input.value.trim();
        
        // Buscamos directamente en el objeto de usuario por su clave (asumiendo que la clave es el nombre de usuario)
        const contenido = localStorage.getItem(nombreBusqueda);
        let usuarioEncontrado = null;

        if (contenido) {
            try {
                const objeto = JSON.parse(contenido);
                if (objeto && objeto.username === nombreBusqueda) {
                    usuarioEncontrado = objeto;
                }
            } catch (e) { 
                console.error("Error al parsear usuario");
            }
        }

        if (!usuarioEncontrado) {
            Swal.fire({ title: "Usuario no encontrado", text: "Asegúrate de escribir el nombre de usuario exacto.", icon: "error", confirmButtonColor: "#365652" });
            return;
        }

        if (usuarioEncontrado.rol !== "Estudiante") {
            Swal.fire({ title: "Acceso denegado", text: "Solo puedes agregar Estudiantes registrados.", icon: "warning", confirmButtonColor: "#365652" });
            return;
        }

        if (curso.estudiantes && curso.estudiantes.includes(nombreBusqueda)) {
            Swal.fire({ title: "Ya inscrito", text: "Este alumno ya está en la lista.", icon: "info", confirmButtonColor: "#365652" });
            return;
        }

        if (!curso.estudiantes) curso.estudiantes = [];
        curso.estudiantes.push(nombreBusqueda);
        input.value = "";
        actualizarVistas();
    };

    // --- AGREGAR MATERIALES ---
    window.agregarMaterial = () => {
        const input = document.getElementById("nuevoMaterial");
        const titulo = input.value.trim();
        if (titulo) {
            if (!curso.materiales) curso.materiales = [];
            curso.materiales.push({ id: Date.now(), titulo: titulo });
            input.value = "";
            actualizarVistas();
        }
    };

    // --- AGREGAR TAREAS ---
    window.agregarTarea = () => {
        const inputTitulo = document.getElementById("nuevoTituloTarea");
        const inputPuntos = document.getElementById("puntosTarea");
        const titulo = inputTitulo.value.trim();
        
        if (titulo) {
            if (!curso.tareas) curso.tareas = [];
            curso.tareas.push({ 
                id: Date.now(), 
                titulo: titulo, 
                puntos: inputPuntos.value || 100 
            });
            inputTitulo.value = "";
            actualizarVistas();
        }
    };

    // --- ELIMINAR CUALQUIER ITEM ---
    window.eliminarItem = (tipo, i) => {
        curso[tipo].splice(i, 1);
        actualizarVistas();
    };

    // --- GUARDAR CAMBIOS FINALES ---
    document.getElementById("editForm").addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Sincronizar datos básicos
        curso.nombre = inputNombre.value;
        curso.clave = inputClave.value;
        
        // IMPORTANTE: Aseguramos que el docenteId se mantenga
        curso.docenteId = activeUser.username;

        // Guardar en el índice original
        cursos[index] = curso;
        localStorage.setItem("cursos_docente", JSON.stringify(cursos));
        
        Swal.fire({
            title: "Datos actualizados",
            text: "El curso ha sido guardado exitosamente.",
            icon: "success",
            confirmButtonColor: "#365652"
        }).then(() => window.location.href = "VerCursosDocente.html");
    });

    actualizarVistas();
}); 
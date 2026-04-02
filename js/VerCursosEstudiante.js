document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorCursosEstudiante");
    const btnInscribir = document.getElementById("btnInscribirCurso");
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));

    if (!activeUser) { window.location.href = "index.html"; return; }

   const renderizarCursos = () => {
    const todosLosCursos = JSON.parse(localStorage.getItem("cursos_docente")) || [];
    const misCursos = todosLosCursos.filter(c => c.estudiantes && c.estudiantes.includes(activeUser.username));

    contenedor.innerHTML = "";
    if (misCursos.length === 0) {
        contenedor.innerHTML = `<p style="text-align:center; grid-column: 1/-1;">No estás inscrito en ninguna materia.</p>`;
        return;
    }

    misCursos.forEach(curso => {
        const card = document.createElement("div");
        card.className = "course-card";
        
        // Creamos el contenedor de botones
        const actionsContainer = document.createElement("div");
        actionsContainer.style.display = "flex";
        actionsContainer.style.flexDirection = "column";
        actionsContainer.style.gap = "8px";
        actionsContainer.style.marginTop = "12px";

        // Botón Ver (Usamos tu clase existente)
        const btnVer = document.createElement("button");
        btnVer.className = "btn-submit btn-ver";
        btnVer.dataset.clave = curso.clave;
        btnVer.textContent = "Ver Contenido";

        // Botón Dar de Baja (Copiamos el estilo del anterior)
        const btnBaja = document.createElement("button");
        btnBaja.className = "btn-submit btn-delete-course"; // Hereda la clase principal para la fuente
        btnBaja.dataset.clave = curso.clave;
        btnBaja.textContent = "Dar de baja";
        
        // Estilos específicos solo para el color y margen, manteniendo la fuente de la clase btn-submit
        btnBaja.style.backgroundColor = "#a93226"; 
        btnBaja.style.marginTop = "0"; // Quitamos márgenes extra si la clase los trae
        btnBaja.style.fontSize = "0.85em"; // Para que se vea estilizado
        
        // Estructuramos la tarjeta
        card.innerHTML = `
            <h3>${curso.nombre}</h3>
            <p style="font-size: 0.8em; color: #888;">Clave: ${curso.clave}</p>
        `;
        
        actionsContainer.appendChild(btnVer);
        actionsContainer.appendChild(btnBaja);
        card.appendChild(actionsContainer);
        contenedor.appendChild(card);
    });
};
    // --- LÓGICA PARA INSCRIBIR ---
    btnInscribir.addEventListener("click", async () => {
        const { value: clave } = await Swal.fire({
            title: 'Inscribir Materia',
            input: 'text',
            inputPlaceholder: 'Ingresa la clave del curso',
            showCancelButton: true,
            confirmButtonColor: "#365652"
        });

        if (clave) {
            let cursosGlobales = JSON.parse(localStorage.getItem("cursos_docente")) || [];
            const index = cursosGlobales.findIndex(c => c.clave === clave.trim());

            if (index === -1) {
                Swal.fire('Error', 'Clave no encontrada', 'error');
            } else {
                if (!cursosGlobales[index].estudiantes) cursosGlobales[index].estudiantes = [];
                if (cursosGlobales[index].estudiantes.includes(activeUser.username)) {
                    Swal.fire('Aviso', 'Ya estás inscrito', 'info');
                } else {
                    cursosGlobales[index].estudiantes.push(activeUser.username);
                    localStorage.setItem("cursos_docente", JSON.stringify(cursosGlobales));
                    Swal.fire('¡Éxito!', 'Inscrito correctamente', 'success');
                    renderizarCursos();
                }
            }
        }
    });

    // --- LÓGICA PARA VER Y ELIMINAR (Delegación de eventos) ---
    contenedor.addEventListener("click", (e) => {
        const clave = e.target.dataset.clave;

        // BOTÓN VER
        if (e.target.classList.contains("btn-ver")) {
            localStorage.setItem("curso_actual_estudiante", clave);
            window.location.href = "ContenidoCursoEstudiante.html";
        }

        // BOTÓN ELIMINAR (Dar de baja)
        if (e.target.classList.contains("btn-delete-course")) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Te darás de baja de esta materia.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, dar de baja',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    let cursosGlobales = JSON.parse(localStorage.getItem("cursos_docente")) || [];
                    const index = cursosGlobales.findIndex(c => c.clave === clave);

                    if (index !== -1) {
                        // Filtramos el arreglo de estudiantes para quitar al usuario actual
                        cursosGlobales[index].estudiantes = cursosGlobales[index].estudiantes.filter(user => user !== activeUser.username);
                        
                        localStorage.setItem("cursos_docente", JSON.stringify(cursosGlobales));
                        Swal.fire('Eliminado', 'Has sido dado de baja del curso.', 'success');
                        renderizarCursos();
                    }
                }
            });
        }
    });

    renderizarCursos();
});
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorCursos");
    const btnAgregar = document.getElementById("btnAgregarCurso");
    const teacherNameSpan = document.getElementById("teacher-name");
    const logoutBtn = document.getElementById("logoutBtn");

    // 1. Identificar al usuario logueado
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));
    
    if (!activeUser) {
        window.location.href = "Iniciar_sesionBD.html";
        return;
    }

    if (teacherNameSpan) {
        teacherNameSpan.textContent = activeUser.username;
    }

    // 2. Función para pintar SOLO los cursos de este docente
    const renderizarCursos = () => {
        const todosLosCursos = JSON.parse(localStorage.getItem("cursos_docente")) || [];
        contenedor.innerHTML = ""; 

        // FILTRADO ESTRICTO: Solo los cursos que pertenecen a este maestro
        const misCursos = todosLosCursos.filter(curso => curso.docenteId === activeUser.username);

        if (misCursos.length === 0) {
            const emptyCard = document.createElement("div");
            emptyCard.className = "course-card"; 
            emptyCard.style.gridColumn = "1 / -1";
            emptyCard.style.textAlign = "center";
            emptyCard.style.padding = "40px";
            emptyCard.style.border = "2px dashed #2d4b49"; 
            emptyCard.innerHTML = `
                <div class="empty-state-content">
                    <h3 style="color: #535353; margin-bottom: 10px;">Aún no tienes cursos que impartir</h3>
                    <p style="color: #666; font-size: 0.95em;">Comienza agregando tu primera materia con el botón superior.</p>
                </div>`;
            contenedor.appendChild(emptyCard);
            return;
        }

        misCursos.forEach((curso) => {
            const indexGlobal = todosLosCursos.findIndex(c => 
                c.clave === curso.clave && c.docenteId === activeUser.username
            );
            
            const card = document.createElement("div");
            card.className = "course-card";
            card.innerHTML = `
                <div>
                    <h3 style="color: #365652; margin-bottom: 5px;">${curso.nombre}</h3>
                    <p style="font-size: 0.85em; color: #555;"><strong>Clave:</strong> ${curso.clave}</p>
                    <p style="font-size: 0.8em; color: #888;">Alumnos: ${(curso.estudiantes || []).length}</p>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                    <button class="btn-submit btn-inspeccionar" data-index="${indexGlobal}" style="font-size: 0.8em; padding: 8px; background-color: #185951;">Inspeccionar Curso</button>
                    <button class="btn-submit btn-editar" data-index="${indexGlobal}" style="font-size: 0.8em; padding: 8px;">Editar</button>
                    <button class="btn-submit btn-eliminar" data-index="${indexGlobal}" style="font-size: 0.8em; padding: 8px; background-color: #cc3333;">Eliminar</button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    };

    // 3. Agregar Curso con ID de dueño y validación de duplicados
    btnAgregar.addEventListener("click", async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Nuevo Curso',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Nombre de la materia">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Clave de la materia">',
            focusConfirm: false,
            confirmButtonText: 'Guardar',
            confirmButtonColor: '#365652',
            showCancelButton: true,
            preConfirm: () => {
                const nombre = document.getElementById('swal-input1').value.trim();
                const clave = document.getElementById('swal-input2').value.trim();
                if (!nombre || !clave) {
                    Swal.showValidationMessage('Por favor rellena ambos campos');
                    return false;
                }
                return { nombre, clave };
            }
        });

        if (formValues) {
            let cursosGlobales = JSON.parse(localStorage.getItem("cursos_docente")) || [];
            
            const claveDuplicada = cursosGlobales.some(c => 
                c.clave === formValues.clave && c.docenteId === activeUser.username
            );

            if (claveDuplicada) {
                Swal.fire('Error', 'Ya tienes un curso registrado con esa clave.', 'error');
                return;
            }
            
            const nuevoCurso = {
                nombre: formValues.nombre, 
                clave: formValues.clave,
                docenteId: activeUser.username,
                estudiantes: [], 
                tareas: [], 
                materiales: [] 
            };

            cursosGlobales.push(nuevoCurso);
            localStorage.setItem("cursos_docente", JSON.stringify(cursosGlobales));
            renderizarCursos();
            Swal.fire('¡Éxito!', 'Curso creado correctamente', 'success');
        }
    });

    // 4. Delegación de eventos (Inspeccionar/Editar/Eliminar)
    contenedor.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        if (index === null) return;

        // ACCIÓN: Inspeccionar
        if (e.target.classList.contains("btn-inspeccionar")) {
            let cursosGlobales = JSON.parse(localStorage.getItem("cursos_docente"));
            const cursoSeleccionado = cursosGlobales[index];

            if (cursoSeleccionado && cursoSeleccionado.docenteId === activeUser.username) {
                // Guardamos la clave para identificar el curso en la nueva página
                localStorage.setItem("curso_a_inspeccionar", cursoSeleccionado.clave);
                window.location.href = "InspeccionarCurso.html";
            }
        }

        // ACCIÓN: Eliminar
        if (e.target.classList.contains("btn-eliminar")) {
            Swal.fire({
                title: '¿Eliminar curso?',
                text: "Se borrarán todos los datos de esta materia",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#cc3333',
                confirmButtonText: 'Sí, borrar'
            }).then((result) => {
                if (result.isConfirmed) {
                    let cursosGlobales = JSON.parse(localStorage.getItem("cursos_docente"));
                    if (cursosGlobales[index].docenteId === activeUser.username) {
                        cursosGlobales.splice(index, 1);
                        localStorage.setItem("cursos_docente", JSON.stringify(cursosGlobales));
                        renderizarCursos();
                    } else {
                        Swal.fire('Error', 'No tienes permiso para eliminar este curso', 'error');
                    }
                }
            });
        }

        // ACCIÓN: Editar
        if (e.target.classList.contains("btn-editar")) {
            let cursosGlobales = JSON.parse(localStorage.getItem("cursos_docente"));
            if (cursosGlobales[index].docenteId === activeUser.username) {
                localStorage.setItem("curso_a_editar", index);
                window.location.href = "EditarCursosDocentes.html";
            }
        }
    });

    // Logout
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("usuario_activo");
        window.location.href = "Iniciar_sesionBD.html";
    });

    renderizarCursos();
});
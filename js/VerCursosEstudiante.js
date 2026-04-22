document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorCursosEstudiante");
    const btnInscribir = document.getElementById("btnInscribirCurso");
    const logoutBtn = document.getElementById("logoutBtn"); // 1. Referencia al botón de cerrar sesión
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));

    // 2. SEGURIDAD Y CARGA DE NOMBRE
    if (!activeUser) { 
        window.location.href = "index.html"; 
        return; 
    } else {
        // CARGA EL NOMBRE Y LA INICIAL EN EL HEADER
        document.getElementById("profile-name").textContent = activeUser.username;
        document.getElementById("profile-initial").textContent = activeUser.username.charAt(0).toUpperCase();
    }

    // 3. LÓGICA DE CERRAR SESIÓN (Esto era lo que faltaba)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("usuario_activo");
            // Usamos SweetAlert para que se vea profesional
            Swal.fire({
                title: 'Sesión Cerrada',
                text: 'Has salido del portal con éxito.',
                icon: 'success',
                confirmButtonColor: '#365652'
            }).then(() => {
                window.location.href = "index.html"; 
            });
        });
    }

    const renderizarCursos = () => {
        const todosLosCursos = JSON.parse(localStorage.getItem("cursos_docente")) || [];
        const misCursos = todosLosCursos.filter(c => c.estudiantes && c.estudiantes.includes(activeUser.username));

        contenedor.innerHTML = "";
        if (misCursos.length === 0) {
            contenedor.innerHTML = `<p style="text-align:center; grid-column: 1/-1; width: 100%; color: #666;">No estás inscrito en ninguna materia.</p>`;
            return;
        }

        misCursos.forEach(curso => {
            const card = document.createElement("div");
            card.className = "course-card";
            
            const actionsContainer = document.createElement("div");
            actionsContainer.style.display = "flex";
            actionsContainer.style.flexDirection = "column";
            actionsContainer.style.gap = "8px";
            actionsContainer.style.marginTop = "12px";

            const btnVer = document.createElement("button");
            btnVer.className = "btn-submit btn-ver";
            btnVer.dataset.clave = curso.clave;
            btnVer.textContent = "Ver Contenido";

            const btnBaja = document.createElement("button");
            btnBaja.className = "btn-submit btn-delete-course"; 
            btnBaja.dataset.clave = curso.clave;
            btnBaja.textContent = "Dar de baja";
            
            btnBaja.style.backgroundColor = "#a93226"; 
            btnBaja.style.marginTop = "0"; 
            btnBaja.style.fontSize = "0.85em"; 
            
            card.innerHTML = `
                <h3 style="color: #365652; font-family: 'CiscoSans', sans-serif;">${curso.nombre}</h3>
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
            confirmButtonColor: "#365652",
            cancelButtonText: 'Cancelar'
        });

        if (clave) {
            let cursosGlobales = JSON.parse(localStorage.getItem("cursos_docente")) || [];
            const index = cursosGlobales.findIndex(c => c.clave === clave.trim());

            if (index === -1) {
                Swal.fire('Error', 'La clave del curso no existe.', 'error');
            } else {
                if (!cursosGlobales[index].estudiantes) cursosGlobales[index].estudiantes = [];
                
                if (cursosGlobales[index].estudiantes.includes(activeUser.username)) {
                    Swal.fire('Aviso', 'Ya te encuentras inscrito en esta materia.', 'info');
                } else {
                    cursosGlobales[index].estudiantes.push(activeUser.username);
                    localStorage.setItem("cursos_docente", JSON.stringify(cursosGlobales));
                    Swal.fire('¡Éxito!', 'Te has inscrito correctamente.', 'success');
                    renderizarCursos();
                }
            }
        }
    });

    // --- DELEGACIÓN DE EVENTOS (VER Y ELIMINAR) ---
    contenedor.addEventListener("click", (e) => {
        const clave = e.target.dataset.clave;
        if (!clave) return;

        if (e.target.classList.contains("btn-ver")) {
            localStorage.setItem("curso_actual_estudiante", clave);
            window.location.href = "ContenidoCursoEstudiante.html";
        }

        if (e.target.classList.contains("btn-delete-course")) {
            Swal.fire({
                title: '¿Darse de baja?',
                text: "Ya no podrás ver el contenido de esta materia.",
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
                        cursosGlobales[index].estudiantes = cursosGlobales[index].estudiantes.filter(user => user !== activeUser.username);
                        localStorage.setItem("cursos_docente", JSON.stringify(cursosGlobales));
                        Swal.fire('Eliminado', 'Has sido dado de baja.', 'success');
                        renderizarCursos();
                    }
                }
            });
        }
    });

    renderizarCursos();
});
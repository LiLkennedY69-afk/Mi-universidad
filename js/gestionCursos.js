document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorCursos");
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));

    // 1. Seguridad: Solo el Administrador puede gestionar
    if (!activeUser || activeUser.rol !== "Administrador") {
        window.location.href = "Iniciar_sesionBD.html";
        return;
    }

    // Datos del Header
    document.getElementById("profile-name").textContent = activeUser.username;
    document.getElementById("profile-initial").textContent = activeUser.username.charAt(0).toUpperCase();

    const cargarCursos = () => {
        // Recuperamos las dos listas necesarias
        const listaCursos = JSON.parse(localStorage.getItem("cursos_docente")) || [];
        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        
        contenedor.innerHTML = "";

        if (listaCursos.length === 0) {
            contenedor.innerHTML = "<p style='text-align: center; width: 100%; color: #666;'>No hay cursos registrados en el sistema.</p>";
            return;
        }

        listaCursos.forEach(curso => {
            // BUSCAR AL DOCENTE: Buscamos en usuarios_registrados el que coincida con el ID/Nombre asignado al curso
            const docenteAsignado = listaUsuarios.find(u => u.username === curso.docenteId);
            const nombreDocente = docenteAsignado ? docenteAsignado.username : "Sin docente asignado";

            const card = document.createElement("div");
            card.className = "course-card";
            
            card.innerHTML = `
                <div style="flex-grow: 1;">
                    <h3 style="color: #365652; margin-bottom: 5px; font-family: 'CiscoSans', sans-serif;">${curso.nombre}</h3>
                    <p style="font-size: 0.85em; color: #444; margin-bottom: 5px;">
                        <strong>Clave:</strong> ${curso.clave}
                    </p>
                    <p style="font-size: 0.9em; color: #a4363e; font-weight: bold;">
                         Docente: ${nombreDocente}
                    </p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 15px;">
                    <button class="btn-submit" onclick="verInfoCurso('${curso.clave}')" style="font-size: 0.8em; padding: 10px;">Ver Detalles</button>
                    <button class="btn-submit-eliminar" 
                            onclick="eliminarCurso('${curso.clave}')" 
                            style="background-color: #a4363e; color: white; border: none; border-radius: 5px; padding: 10px; cursor: pointer; font-size: 0.8em; font-weight: bold;">
                        Eliminar Curso
                    </button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    };

    // Función para el modal informativo
    window.verInfoCurso = (clave) => {
        const cursos = JSON.parse(localStorage.getItem("cursos_docente")) || [];
        const usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        const curso = cursos.find(c => c.clave === clave);
        const docente = usuarios.find(u => u.username === curso.docenteId);
        
        Swal.fire({
            title: `Detalles: ${curso.nombre}`,
            html: `
                <div style="text-align: left; font-family: 'CiscoSans', sans-serif;">
                    <p><strong>Clave de materia:</strong> ${curso.clave}</p>
                    <p><strong>Catedrático:</strong> ${docente ? docente.username : 'No asignado'}</p>
                    <p><strong>Correo docente:</strong> ${docente ? docente.email : 'N/A'}</p>
                </div>
            `,
            icon: 'info',
            confirmButtonColor: '#365652'
        });
    };

    // Función para eliminar curso
    window.eliminarCurso = (clave) => {
        Swal.fire({
            title: '¿Eliminar curso?',
            text: "Esta acción es irreversible en la base de datos local.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#a4363e',
            cancelButtonColor: '#4a4a4a',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                let cursos = JSON.parse(localStorage.getItem("cursos_docente")) || [];
                cursos = cursos.filter(c => c.clave !== clave);
                localStorage.setItem("cursos_docente", JSON.stringify(cursos));
                cargarCursos();
                Swal.fire('Eliminado', 'Curso removido con éxito.', 'success');
            }
        });
    };

    // Cerrar sesión
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("usuario_activo");
        window.location.href = "Iniciar_sesionBD.html";
    });

    cargarCursos();
});
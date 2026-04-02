document.addEventListener("DOMContentLoaded", () => {
    const listaSolicitudes = document.getElementById("listaSolicitudes");
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));

    if (!activeUser) {
        window.location.href = "Iniciar_sesionBD.html";
        return;
    }

    // Cargar datos básicos del header
    document.getElementById("profile-name").textContent = activeUser.username;
    document.getElementById("profile-initial").textContent = activeUser.username.charAt(0).toUpperCase();

    const cargarSolicitudes = () => {
        const cursos = JSON.parse(localStorage.getItem("cursos_docente")) || [];
        // Filtramos solo los cursos de este docente que tengan alumnos pendientes
        const misCursosConPendientes = cursos.filter(c => c.docenteId === activeUser.username && c.pendientes && c.pendientes.length > 0);

        listaSolicitudes.innerHTML = "";

        if (misCursosConPendientes.length === 0) {
            listaSolicitudes.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 20px;">No hay solicitudes pendientes.</td></tr>`;
            return;
        }

        misCursosConPendientes.forEach(curso => {
            curso.pendientes.forEach((alumno, index) => {
                const fila = document.createElement("tr");
                fila.style.borderBottom = "1px solid #ddd";
                
                fila.innerHTML = `
                    <td style="padding: 12px; font-family: 'CiscoSans', sans-serif;">${alumno}</td>
                    <td style="padding: 12px;">${curso.nombre}</td>
                    <td style="padding: 12px; text-align: center;">
                        <button onclick="gestionarAlumno('${alumno}', '${curso.clave}', 'aceptar')" class="btn-submit" style="padding: 5px 10px; font-size: 0.8em; background-color: #28a745; margin-right: 5px;">Aceptar</button>
                        <button onclick="gestionarAlumno('${alumno}', '${curso.clave}', 'rechazar')" class="btn-submit" style="padding: 5px 10px; font-size: 0.8em; background-color: #dc3545;">Rechazar</button>
                    </td>
                `;
                listaSolicitudes.appendChild(fila);
            });
        });
    };

    window.gestionarAlumno = (nombreAlumno, claveCurso, accion) => {
        let cursos = JSON.parse(localStorage.getItem("cursos_docente")) || [];
        const cursoIndex = cursos.findIndex(c => c.clave === claveCurso);

        if (cursoIndex !== -1) {
            // Quitar de pendientes
            cursos[cursoIndex].pendientes = cursos[cursoIndex].pendientes.filter(a => a !== nombreAlumno);

            if (accion === 'aceptar') {
                if (!cursos[cursoIndex].estudiantes) cursos[cursoIndex].estudiantes = [];
                cursos[cursoIndex].estudiantes.push(nombreAlumno);
                Swal.fire("Aceptado", `${nombreAlumno} ahora está en el curso.`, "success");
            } else {
                Swal.fire("Rechazado", "La solicitud ha sido eliminada.", "info");
            }

            localStorage.setItem("cursos_docente", JSON.stringify(cursos));
            cargarSolicitudes();
        }
    };

    cargarSolicitudes();
});
// Variable para saber qué pestaña está activa (por defecto Docentes)
let vistaActual = 'Docente'; 

document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("contenedorLista");
    const titulo = document.getElementById("tituloSeccion");
    const profileName = document.getElementById("profile-name");
    // --- LÓGICA PARA EL BOTÓN "+ AUTORIZAR NUEVO" ---
    const btnAbrirModal = document.getElementById("btnAbrirModal");

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener("click", () => {
            const todos = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
            // Filtrar solo los que NO están activos y NO son administradores
            const pendientes = todos.filter(u => u.activo !== true && u.rol !== "Administrador");

            if (pendientes.length === 0) {
                Swal.fire({
                    title: 'Sin pendientes',
                    text: 'No hay usuarios nuevos esperando autorización.',
                    icon: 'info',
                    confirmButtonColor: '#365652'
                });
                return;
            }

            // Crear una lista simple para el modal
            let listaHtml = '<div style="text-align: left; max-height: 300px; overflow-y: auto;">';
            pendientes.forEach(u => {
                listaHtml += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                        <span><strong>${u.username}</strong> (${u.rol})</span>
                        <button onclick="autorizarDesdeModal('${u.username}')" 
                                style="background: #27ae60; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                            Autorizar
                        </button>
                    </div>`;
            });
            listaHtml += '</div>';

            Swal.fire({
                title: 'Usuarios Pendientes',
                html: listaHtml,
                showConfirmButton: false,
                showCloseButton: true
            });
        });
    }

    // Función global para el botón dentro del modal
    window.autorizarDesdeModal = (username) => {
        let usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        const index = usuarios.findIndex(u => u.username === username);
        
        if (index !== -1) {
            usuarios[index].activo = true;
            localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));
            
            // Cerrar el modal y refrescar la tabla de fondo
            Swal.close();
            renderizar();
            
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Usuario ${username} autorizado`,
                showConfirmButton: false,
                timer: 2000
            });
        }
    };
    
    // 1. Verificar sesión del Administrador
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));
    if (!activeUser || activeUser.rol !== "Administrador") {
        window.location.href = "Iniciar_sesionBD.html";
        return;
    }
    if (profileName) profileName.textContent = activeUser.username;

    /**
     * Función para cambiar entre Docentes y Estudiantes
     * Vinculada a los onclick de tu HTML
     */
    window.cambiarSeccion = (tipo) => {
        // Normalizamos el tipo que viene del HTML para que coincida con el ROL
        vistaActual = (tipo.includes('profesor')) ? 'Docente' : 'Estudiante';
        
        // Actualizar visualmente los botones
        const btnP = document.getElementById("btnTabProf");
        const btnE = document.getElementById("btnTabEst");
        
        if (vistaActual === 'Docente') {
            btnP.style.backgroundColor = "#365652";
            btnE.style.backgroundColor = "#4a4a4a";
            titulo.textContent = "Usuarios Autorizados: Docentes";
        } else {
            btnP.style.backgroundColor = "#4a4a4a";
            btnE.style.backgroundColor = "#365652";
            titulo.textContent = "Usuarios Autorizados: Estudiantes";
        }
        
        renderizar();
    };

    /**
     * Función principal para dibujar la tabla
     */
    function renderizar() {
        // Leemos todos los usuarios registrados en el sistema
        const todosLosUsuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        
        // Filtramos solo los que pertenecen a la pestaña actual
        const listaFiltrada = todosLosUsuarios.filter(u => u.rol === vistaActual);
        
        tabla.innerHTML = "";

        if (listaFiltrada.length === 0) {
            tabla.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:#999;">
                No hay ${vistaActual.toLowerCase()}s registrados en el sistema.
            </td></tr>`;
            return;
        }

        listaFiltrada.forEach((usuario) => {
            const fila = document.createElement("tr");
            fila.style.borderBottom = "1px solid #eee";

            // Si el atributo 'activo' no existe, lo tratamos como false (No autorizado)
            const esAutorizado = usuario.activo === true;

            const statusHTML = esAutorizado 
                ? '<span style="color: #27ae60; font-weight: bold;">Autorizado</span>' 
                : '<span style="color: #a4363e; font-weight: bold;">Pendiente</span>';

            fila.innerHTML = `
                <td style="padding: 15px; text-align: left;">${usuario.username}</td>
                <td style="padding: 15px; text-align: left;">${usuario.email}</td>
                <td style="padding: 15px; text-align: center;">${statusHTML}</td>
                <td style="padding: 15px; text-align: center;">
                    <button onclick="toggleAutorizacion('${usuario.username}')" class="btn-submit" 
                            style="background-color: ${esAutorizado ? '#a4363e' : '#27ae60'}; width: auto; font-size: 0.8em; padding: 6px 15px; margin: 0; cursor: pointer;">
                        ${esAutorizado ? 'Revocar' : 'Autorizar'}
                    </button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    /**
     * Función para cambiar el estatus de un usuario
     */
    window.toggleAutorizacion = (username) => {
        let usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        const index = usuarios.findIndex(u => u.username === username);
        
        if (index !== -1) {
            // Cambiamos el estado (si era true pasa a false y viceversa)
            usuarios[index].activo = !usuarios[index].activo;
            
            // Guardamos en la base de datos global
            localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));
            
            // Refrescamos la tabla para ver el cambio
            renderizar();
        }
    };

    // Cerrar sesión
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        localStorage.removeItem("usuario_activo");
        window.location.href = "Iniciar_sesionBD.html";
    });

    // Carga inicial
    renderizar();
});
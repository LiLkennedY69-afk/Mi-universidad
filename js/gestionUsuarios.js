document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorUsuarios");
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));

    // 1. Verificación de Seguridad: Solo permite el acceso al Administrador
    if (!activeUser || activeUser.rol !== "Administrador") {
        window.location.href = "Iniciar_sesionBD.html";
        return;
    }

    // Cargar el nombre del administrador actual en el header
    const profileNameElement = document.getElementById("profile-name");
    if (profileNameElement) {
        profileNameElement.textContent = activeUser.username;
    }

    // 2. Función Principal: Renderizar las tarjetas de usuarios dinámicamente
    const renderizarUsuarios = () => {
        // Obtenemos la lista desde la clave correcta observada en tu consola
        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        
        contenedor.innerHTML = "";

        if (listaUsuarios.length === 0) {
            contenedor.innerHTML = "<p style='text-align: center; width: 100%; color: #666;'>No hay usuarios registrados.</p>";
            return;
        }

        listaUsuarios.forEach(user => {
            const card = document.createElement("div");
            card.className = "course-card";
            
            // PRIORIDAD: Usar el rol capturado en el registro
            const rolActual = user.rol ? user.rol : "Estudiante";

            card.innerHTML = `
                <div>
                    <h3 style="color: #365652; margin-bottom: 5px; font-family: 'CiscoSans', sans-serif;">${user.username}</h3>
                    <p style="font-size: 0.9em; color: #666; font-weight: bold;">${rolActual}</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 10px;">
                    <button class="btn-submit" onclick="verDetalles('${user.username}')" style="font-size: 0.8em; padding: 8px;">Ver Perfil</button>
                    
                    ${user.username !== activeUser.username ? `
                        <button class="btn-submit-eliminar" 
                                onclick="eliminarUsuario('${user.username}')" 
                                style="background-color: #a4363e; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 8px; font-family: 'CiscoSans', sans-serif; font-weight: bold; font-size: 0.8em;">
                            Eliminar
                        </button>
                    ` : '<p style="font-size: 0.7em; color: #365652; text-align: center; font-weight: bold;">(Tu sesión)</p>'}
                </div>
            `;
            contenedor.appendChild(card);
        });
    };

    // 3. Función: Mostrar modal con toda la información técnica
    window.verDetalles = (username) => {
        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        const user = listaUsuarios.find(u => u.username === username);

        if (user) {
            Swal.fire({
                title: `Ficha de Usuario: ${user.username}`,
                html: `
                    <div style="text-align: left; font-family: 'CiscoSans', sans-serif; font-size: 0.9em; line-height: 1.6;">
                        <p><strong>Correo Institucional:</strong> ${user.email}</p>
                        <p><strong>Contraseña registrada:</strong> <span style="color: #a4363e; font-weight: bold;">${user.password}</span></p>
                        <p><strong>Rol en el sistema:</strong> <span style="color: #365652; font-weight: bold;">${user.rol || 'Estudiante'}</span></p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                        <p style="font-size: 0.75em; color: #888;">Datos recuperados exitosamente del Local Storage.</p>
                    </div>
                `,
                icon: 'info',
                confirmButtonColor: '#365652',
                confirmButtonText: 'Entendido'
            });
        }
    };

    // 4. Función: Eliminar usuario con confirmación
    window.eliminarUsuario = (username) => {
        Swal.fire({
            title: `¿Confirmas la eliminación?`,
            text: `El usuario "${username}" perderá todo acceso al portal.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#a4363e',
            cancelButtonColor: '#4a4a4a',
            confirmButtonText: 'Eliminar permanentemente',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                let usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
                usuarios = usuarios.filter(u => u.username !== username);
                
                localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));
                Swal.fire('Actualizado', 'La base de datos local ha sido actualizada.', 'success');
                renderizarUsuarios();
            }
        });
    };

    // 5. Gestión del Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("usuario_activo");
            window.location.href = "Iniciar_sesionBD.html";
        });
    }

    renderizarUsuarios();
});
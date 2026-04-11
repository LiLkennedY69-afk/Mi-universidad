document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); 

            const emailInput = document.getElementById("email").value.trim().toLowerCase();
            const passwordInput = document.getElementById("password").value;

            // 1. Obtener los usuarios de LocalStorage
            const users = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];

            // 2. Buscar coincidencia exacta
            const validUser = users.find(user => 
                user.email === emailInput && 
                user.password === passwordInput
            );

            if (validUser) {
                // --- LÓGICA DE ROLES: Carácter ANTES del '@' ---
                const posicionArroba = emailInput.indexOf('@');
                const identificadorRol = emailInput.charAt(posicionArroba - 1); 

                let rolAsignado = "";
                let destinoURL = "";

                if (identificadorRol === 'a') {
                    rolAsignado = "Administrador";
                    destinoURL = "HomeAdmin.html";
                } else if (identificadorRol === 'd') {
                    rolAsignado = "Docente";
                    destinoURL = "HomeBDDocen.html";
                } else if (identificadorRol === 'e') {
                    rolAsignado = "Estudiante";
                    destinoURL = "HomeBD.html";
                } else {
                    Swal.fire({
                        title: 'Error de Rol',
                        text: 'No se detectó un rol válido (a, d, e) antes del @.',
                        icon: 'error'
                    });
                    return;
                }

                // --- 3. NUEVA LÓGICA DE AUTORIZACIÓN ---
                // El Administrador siempre puede entrar. Docentes y Estudiantes requieren activo === true
                if (rolAsignado !== "Administrador" && validUser.activo !== true) {
                    Swal.fire({
                        title: 'Cuenta Pendiente',
                        text: 'Tu acceso aún no ha sido autorizado por el administrador. Por favor, espera la validación.',
                        icon: 'warning',
                        confirmButtonColor: '#365652'
                    });
                    return; // Bloquea el inicio de sesión aquí
                }

                // 4. Guardar en sesión el usuario activo
                const usuarioLogueado = {
                    ...validUser,
                    rol: rolAsignado
                };
                localStorage.setItem("usuario_activo", JSON.stringify(usuarioLogueado));

                // 5. Alerta y redirección
                Swal.fire({
                    title: `¡Bienvenido, ${validUser.username}!`,
                    text: `Accediendo como ${rolAsignado}...`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    didClose: () => {
                        window.location.href = destinoURL;
                    }
                });

            } else {
                Swal.fire({
                    title: 'Acceso Denegado',
                    text: 'Correo o contraseña incorrectos.',
                    icon: 'error',
                    confirmButtonText: 'Reintentar',
                    confirmButtonColor: '#a4363e'
                });
            }
        });
    }
});
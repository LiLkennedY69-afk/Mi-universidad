document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault(); 

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim().toLowerCase();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            // 1. Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
                return;
            }

            // 2. Lógica de Identificación de Rol (Letra antes del @)
            const posicionArroba = email.indexOf('@');
            if (posicionArroba === -1) {
                Swal.fire('Error', 'Correo no válido', 'error');
                return;
            }

            const letraRol = email.charAt(posicionArroba - 1);
            let rolAsignado = "";

            // Mapeo de letra a Rol institucional (Agregada la 's')
            if (letraRol === 'a') {
                rolAsignado = "Administrador";
            } else if (letraRol === 'd') {
                rolAsignado = "Docente";
            } else if (letraRol === 'e') {
                rolAsignado = "Estudiante";
            } else if (letraRol === 's') {
                rolAsignado = "Secretaria"; // Nueva función añadida
            } else {
                Swal.fire({
                    title: 'Correo no válido',
                    // Mensaje actualizado para incluir la "s"
                    text: 'El correo debe terminar en "a", "d", "e" o "s" justo antes del @ (ej. usuarios@gmail.com)',
                    icon: 'warning'
                });
                return;
            }

            // 3. Gestión del LocalStorage
            let users = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];

            // Verificar si el correo ya está registrado
            if (users.find(u => u.email === email)) {
                Swal.fire('Error', 'Este correo ya existe en el sistema', 'error');
                return;
            }

            // 4. Crear el objeto con el campo ROL incluido
            const newUser = { 
                username: username, 
                email: email, 
                password: password,
                rol: rolAsignado 
            };

            // Guardar en el arreglo y subir al LocalStorage
            users.push(newUser);
            localStorage.setItem("usuarios_registrados", JSON.stringify(users));

            // 5. Éxito y Redirección
            Swal.fire({
                title: `¡Bienvenido, ${rolAsignado}!`,
                text: 'Tu cuenta ha sido creada exitosamente.',
                icon: 'success',
                timer: 2500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "Iniciar_sesionBD.html";
            });
        });
    }
});
emailjs.init("k1iF1znrc4kgkMQqH"); // Tu llave pública

document.getElementById('recoveryForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const emailEscrito = document.getElementById('email').value.trim();
    const usuarios = JSON.parse(localStorage.getItem('usuarios_registrados')) || [];
    const usuarioEncontrado = usuarios.find(user => user.email === emailEscrito);

    if (usuarioEncontrado) {
        // Mostramos una alerta de "Cargando" mientras se envía el correo
        Swal.fire({
            title: 'Enviando...',
            text: 'Estamos procesando tu solicitud con el servidor de Mi Universidad',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        const datosEnvio = {
            user_name: usuarioEncontrado.username,
            user_password: usuarioEncontrado.password,
            email: usuarioEncontrado.email
        };

        emailjs.send('service_j6889mb', 'template_34ol4hi', datosEnvio)
            .then(() => {
                // Alerta de éxito personalizada
                Swal.fire({
                    title: '¡Correo Enviado!',
                    text: 'Tu contraseña ha sido enviada con éxito a tu bandeja de entrada.',
                    icon: 'success',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#2d572c' // Color verde institucional si gustas
                });
            }, (error) => {
                Swal.fire({
                    title: 'Error técnico',
                    text: 'No pudimos conectar con el servicio de correo. Intenta más tarde.',
                    icon: 'error'
                });
                console.error("Fallo:", error);
            });
    } else {
        // Alerta de advertencia si el correo no existe
        Swal.fire({
            title: 'Usuario no encontrado',
            text: 'El correo institucional ingresado no está registrado en nuestro portal.',
            icon: 'warning',
            confirmButtonText: 'Intentar de nuevo'
        });
    }
});
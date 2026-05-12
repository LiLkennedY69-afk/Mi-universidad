document.addEventListener("DOMContentLoaded", () => {
    // Referencias a los elementos de la interfaz
    const profileName = document.getElementById("profile-name");
    const profileInitial = document.getElementById("profile-initial");
    const displayUsername = document.getElementById("display-username");
    const displayEmail = document.getElementById("display-email");
    const displayRole = document.getElementById("display-role");
    const logoutBtn = document.getElementById("logoutBtn");
    const btnVerCursos = document.getElementById("VerCursosEstudiante");

    // 1. Obtener la sesión activa
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));

    // Redirección si no hay sesión
    if (!activeUser) {
        window.location.href = "Iniciar_sesionBD.html";
        return;
    }

    // 2. Insertar datos dinámicamente
    profileName.textContent = activeUser.username;
    profileInitial.textContent = activeUser.username.charAt(0).toUpperCase();
    
    displayUsername.textContent = activeUser.username;
    // Se genera un correo institucional basado en el username si no existe en el objeto
    displayEmail.textContent = activeUser.email || `${activeUser.username.toLowerCase()}@uagro.mx`;
    displayRole.textContent = activeUser.rol || "Estudiante";

    // 3. Lógica para Cerrar Sesión
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("usuario_activo");
            window.location.href = "Iniciar_sesionBD.html";
        });
    }

    // 4. Redirección a sus cursos inscritos
    if (btnVerCursos) {
        btnVerCursos.addEventListener("click", () => {
            // Asegúrate de que este archivo HTML exista para el alumno
            window.location.href = "VerCursos.html"; 
        });
    }
});
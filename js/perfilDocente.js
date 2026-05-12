document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener los elementos del DOM
    const profileName = document.getElementById("profile-name");
    const profileInitial = document.getElementById("profile-initial");
    const displayUsername = document.getElementById("display-username");
    const displayEmail = document.getElementById("display-email");
    const displayRole = document.getElementById("display-role");
    const logoutBtn = document.getElementById("logoutBtn");
    const btnVerCursos = document.getElementById("btnVerCursos");

    // 2. Obtener el usuario activo desde el localStorage
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));

    // Redirección de seguridad si no hay sesión iniciada
    if (!activeUser) {
        window.location.href = "Iniciar_sesionBD.html";
        return;
    }

    // 3. Cargar los datos dinámicamente
    // Usamos .username porque es el campo que usas en tu sistema
    profileName.textContent = activeUser.username;
    profileInitial.textContent = activeUser.username.charAt(0).toUpperCase();
    
    displayUsername.textContent = activeUser.username;
    // Si no tienes el campo 'email' guardado, puedes generar uno ficticio basado en el nombre
    displayEmail.textContent = activeUser.email || `${activeUser.username.toLowerCase()}@uagro.mx`;
    displayRole.textContent = activeUser.rol || "Docente";

    // 4. Lógica de Cerrar Sesión
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("usuario_activo");
            window.location.href = "Iniciar_sesionBD.html";
        });
    }

    // 5. Navegación a cursos
    if (btnVerCursos) {
        btnVerCursos.addEventListener("click", () => {
            window.location.href = "VerCursosDocente.html";
        });
    }
});
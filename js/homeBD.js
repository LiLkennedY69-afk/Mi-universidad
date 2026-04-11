document.addEventListener("DOMContentLoaded", () => {
    const profileName = document.getElementById("profile-name");
    const profileInitial = document.getElementById("profile-initial");
    const btnCursos = document.getElementById("VerCursosEstudiante");
    const btnPerfil = document.getElementById("Perfil");
    const logoutBtn = document.getElementById("logoutBtn");

    // Obtenemos el usuario que inició sesión
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));

    if (!activeUser) {
        // Si no hay sesión, mandamos al login
        window.location.href = "Iniciar_sesionBD.html";
        return;
    }

    // Personalizar interfaz
    if (profileName) profileName.textContent = activeUser.username;
    if (profileInitial) profileInitial.textContent = activeUser.username.charAt(0).toUpperCase();

    // Navegación
    btnCursos?.addEventListener("click", () => {
        window.location.href = "VerCursos.html";
    });

    btnPerfil?.addEventListener("click", () => {
        window.location.href = "Perfil.html";
    });

    // Logout
    logoutBtn?.addEventListener("click", () => {
        localStorage.removeItem("usuario_activo");
        window.location.href = "index.html";
    });
});
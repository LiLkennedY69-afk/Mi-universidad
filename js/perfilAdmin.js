document.addEventListener("DOMContentLoaded", () => {
    // Obtenemos los datos del administrador logueado
    const adminActual = JSON.parse(localStorage.getItem("usuario_activo"));

    // Seguridad básica
    if (!adminActual || adminActual.rol !== "Administrador") {
        window.location.href = "Iniciar_sesionBD.html";
        return;
    }

    // Llenar datos en el Header
    document.getElementById("nav-name").textContent = adminActual.username;
    document.getElementById("profile-initial-nav").textContent = adminActual.username.charAt(0).toUpperCase();

    // Llenar datos en la Tarjeta de Perfil
    document.getElementById("display-username").textContent = adminActual.username;
    document.getElementById("display-role").textContent = `Rol: ${adminActual.rol}`;
    document.getElementById("display-email").textContent = adminActual.email;
    document.getElementById("display-password").textContent = adminActual.password;
    document.getElementById("main-avatar").textContent = adminActual.username.charAt(0).toUpperCase();

    // Cerrar Sesión
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("usuario_activo");
        window.location.href = "Iniciar_sesionBD.html";
    });
});
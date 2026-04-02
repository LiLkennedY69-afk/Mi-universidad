document.addEventListener("DOMContentLoaded", () => {
    const profileName = document.getElementById("profile-name");
    const profileInitial = document.getElementById("profile-initial");
    const logoutBtn = document.getElementById("logoutBtn");

    // 1. Verificar si hay un usuario logueado
    const activeUser = JSON.parse(localStorage.getItem("usuario_activo"));

    if (activeUser) {
        profileName.textContent = activeUser.username;
        profileInitial.textContent = activeUser.username.charAt(0).toUpperCase();
    } else {
        alert("⚠️ No has iniciado sesión. Serás redirigido.");
        window.location.href = "Iniciar_sesionBD.html";
    }

    // 2. Lógica para Cerrar Sesión
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("usuario_activo");
            alert("🔒 Has cerrado sesión correctamente.");
            window.location.href = "Iniciar_sesionBD.html";
        });
    }

    // 3. Redirección a Ver Cursos
    const btnVerCursos = document.getElementById("VercursosDocente");
    if (btnVerCursos) {
        btnVerCursos.addEventListener("click", () => {
            window.location.href = "VercursosDocente.html";
        });
    }

    // 4. Redirección a Perfil (Corregido y verificado)
const btnPerfil = document.getElementById("PerfilDoce"); // Debe coincidir con el ID del HTML

if (btnPerfil) {
    btnPerfil.addEventListener("click", () => {
        console.log("Redirigiendo a PerfilDoce.html...");
        window.location.href = "PerfilDoce.html";
    });
} else {
    console.error("No se encontró el botón con ID 'PerfilDoce'");
}
});
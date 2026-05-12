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
    } // <-- Aquí termina la lógica de cerrar sesión

        // 3. Redirección a autorizar Alumnos/Docentes
    const BtnGestionAutorizados = document.getElementById("BtnGestionAutorizados");

    if (BtnGestionAutorizados) {
        BtnGestionAutorizados.addEventListener("click", () => {
            console.log("Redirigiendo a BtnGestionAutorizados.html...");
            window.location.href = "BtnGestionAutorizados.html";
        });
    }

    // 4. Redirección a autorizar Alumnos/Docentes
    const BtnGestionUsuarios = document.getElementById("BtnGestionUsuarios");

    if (BtnGestionUsuarios) {
        BtnGestionUsuarios.addEventListener("click", () => {
            console.log("Redirigiendo a BtnGestionUsuarios.html...");
            window.location.href = "BtnGestionUsuarios.html";
        });
    }

    // 5. Redirección a autorizar Alumnos/Docentes
    const BtnGestionCursos = document.getElementById("BtnGestionCursos");

    if (BtnGestionCursos) {
        BtnGestionCursos.addEventListener("click", () => {
            console.log("Redirigiendo a BtnGestionCursos.html...");
            window.location.href = "BtnGestionCursos.html";
        });
    }

    // 6. Redirección al Perfil del Admin
const BtnPerfilAdmin = document.getElementById("BtnPerfilAdmin");

if (BtnPerfilAdmin) {
    BtnPerfilAdmin.addEventListener("click", (e) => {
        e.preventDefault(); 
        console.log("Intentando ir a: BtnPerfilAdmin.html");
        window.location.href = "./BtnPerfilAdmin.html"; 
    });
}

    });

document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener el nombre del curso desde la URL
    const params = new URLSearchParams(window.location.search);
    const nombreCurso = params.get("curso");

    const tituloH1 = document.getElementById("curso-titulo");
    const descripcionP = document.getElementById("descripcion-curso");
    const contenedorMaterial = document.getElementById("material-estudio");

    // 2. Diccionario de contenidos (Aquí defines qué sale en cada uno)
    const contenidos = {
        "Bases de Datos NoSQL": {
            desc: "Exploración de MongoDB y modelos de datos no relacionales.",
            material: "<ul><li>Introducción a JSON</li><li>CRUD en MongoDB</li><li>Indexación</li></ul>"
        },
        "Redes (CCNA)": {
            desc: "Configuración profesional de infraestructura Cisco.",
            material: "<ul><li>Subnetting VLSM</li><li>Protocolos OSPF/EIGRP</li><li>Seguridad en Switches</li></ul>"
        },
        "IOT": {
            desc: "Sistemas embebidos y conexión a la nube.",
            material: "<ul><li>Programación ESP32-C3</li><li>Protocolo MQTT</li><li>Sensores y Actuadores</li></ul>"
        }
    };

    // 3. Mostrar la información si existe en el diccionario
    if (nombreCurso && contenidos[nombreCurso]) {
        tituloH1.textContent = nombreCurso;
        descripcionP.textContent = contenidos[nombreCurso].desc;
        contenedorMaterial.innerHTML = contenidos[nombreCurso].material;
    } else {
        tituloH1.textContent = "Curso no encontrado";
        contenedorMaterial.innerHTML = "<p>No hay contenido disponible para este curso todavía.</p>";
    }
});
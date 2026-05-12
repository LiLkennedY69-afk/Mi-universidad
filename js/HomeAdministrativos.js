document.addEventListener('DOMContentLoaded', () => {
    const botonesMenu = document.querySelectorAll('.btn-admin-nav');
    const tituloSeccion = document.getElementById('dinamic-title');
    const contenedorPrincipal = document.querySelector('.workspace-body-dark');

    // Diccionario de contenidos para cada sección
    const contenidos = {
        'promedio': `
            <div class="form-card-admin">
                <label class="label-admin">Seleccione el curso académico:</label>
                <select class="select-admin-custom">
                    <option>Cálculo diferencial</option>
                    <option>Bases de Datos</option>
                </select>
                <button class="btn-accion-admin-dark" onclick="ejecutarAccion('Promedio')">CALCULAR RESULTADOS</button>
            </div>
            <div class="resultados-container-dark"><p>Los resultados del promedio aparecerán aquí.</p></div>`,
        
        'historial': `
            <div class="form-card-admin">
                <label class="label-admin">Ingrese la matrícula del alumno:</label>
                <input type="text" class="select-admin-custom" placeholder="Ej. 20240001">
                <button class="btn-accion-admin-dark" onclick="ejecutarAccion('Historial')">BUSCAR HISTORIAL</button>
            </div>
            <div class="resultados-container-dark"><p>El historial académico se mostrará aquí.</p></div>`,

        'constancia': `
            <div class="form-card-admin">
                <label class="label-admin">Matrícula para constancia:</label>
                <input type="text" class="select-admin-custom" placeholder="Ingrese matrícula">
                <button class="btn-accion-admin-dark" onclick="ejecutarAccion('Constancia')">GENERAR PDF</button>
            </div>`,

        'editar': `
            <div class="form-card-admin">
                <label class="label-admin">ID de Acta / Calificación:</label>
                <input type="number" class="select-admin-custom" placeholder="ID de registro">
                <button class="btn-accion-admin-dark" onclick="ejecutarAccion('Edición')">HABILITAR EDICIÓN</button>
            </div>`,

        'baja': `
            <div class="form-card-admin">
                <label class="label-admin">Seleccione materia a dar de baja:</label>
                <select class="select-admin-custom">
                    <option>Cisco Packet Tracer Lab</option>
                    <option>Arquitectura de Sistemas</option>
                </select>
                <button class="btn-accion-admin-dark" style="background-color: #a00;" onclick="ejecutarAccion('Baja')">CONFIRMAR BAJA</button>
            </div>`,

        'certificado': `
            <div class="form-card-admin">
                <label class="label-admin">Matrícula del egresado:</label>
                <input type="text" class="select-admin-custom" placeholder="Matrícula completa">
                <button class="btn-accion-admin-dark" onclick="ejecutarAccion('Certificado')">EMITIR CERTIFICADO</button>
            </div>`
    };

    botonesMenu.forEach(boton => {
        boton.addEventListener('click', () => {
            // 1. Cambiar estado visual
            botonesMenu.forEach(btn => btn.classList.remove('active'));
            boton.classList.add('active');

            // 2. Actualizar Título
            tituloSeccion.textContent = boton.textContent;

            // 3. Cambiar Contenido
            const seccion = boton.getAttribute('data-seccion');
            contenedorPrincipal.innerHTML = contenidos[seccion] || '<p>Sección en desarrollo...</p>';
        });
    });
});

// Función para simular las acciones de los botones
function ejecutarAccion(tipo) {
    const panel = document.querySelector('.resultados-container-dark p');
    if(panel) {
        panel.innerHTML = `<span style="color: #365652;">Ejecutando acción de: <strong>${tipo}</strong>...</span>`;
        setTimeout(() => {
            panel.innerHTML = `Acción de <strong>${tipo}</strong> completada con éxito.`;
        }, 1500);
    } else {
        alert(`Acción de ${tipo} enviada al servidor.`);
    }
}
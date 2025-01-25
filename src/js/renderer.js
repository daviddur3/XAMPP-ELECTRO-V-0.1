document.addEventListener('DOMContentLoaded', () => {
    const selectProjectDirBtn = document.getElementById('selectProjectDir');
    const projectPathInput = document.getElementById('projectPath');
    const servicesList = document.getElementById('servicesList');

    // Cargar servicios al iniciar
    async function loadServices() {
        try {
            const services = await window.electronAPI.listServices();
            
            servicesList.innerHTML = services.map(service => `
                <div class="service-card" data-service="${service.name}">
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                    <div class="service-actions">
                        <button onclick="startService('${service.name}')">Iniciar</button>
                        <button onclick="stopService('${service.name}')">Detener</button>
                        <span class="service-status" id="${service.name.toLowerCase()}-status">Desconocido</span>
                    </div>
                </div>
            `).join('');

            // Actualizar estado de cada servicio
            for (const service of services) {
                try {
                    const status = await window.electronAPI.getServiceStatus(service.name);
                    const statusElement = document.getElementById(`${service.name.toLowerCase()}-status`);
                    statusElement.textContent = status.status;
                    statusElement.classList.add(status.status);
                } catch (error) {
                    console.error(`Error obteniendo estado de ${service.name}:`, error);
                }
            }
        } catch (error) {
            console.error('Error cargando servicios:', error);
        }
    }

    // Selector de directorio de proyectos
    selectProjectDirBtn.addEventListener('click', async () => {
        try {
            const selectedPath = await window.electronAPI.selectProjectDirectory();
            if (selectedPath) {
                projectPathInput.value = selectedPath;
                localStorage.setItem('projectDirectory', selectedPath);
            }
        } catch (error) {
            console.error('Error seleccionando directorio:', error);
        }
    });

    // Funciones globales para iniciar/detener servicios
    window.startService = async (serviceName) => {
        try {
            const result = await window.electronAPI.startService(serviceName);
            alert(result.message);
            loadServices(); // Recargar estado de servicios
        } catch (error) {
            alert(`Error al iniciar ${serviceName}: ${error.message}`);
        }
    };

    window.stopService = async (serviceName) => {
        try {
            const result = await window.electronAPI.stopService(serviceName);
            alert(result.message);
            loadServices(); // Recargar estado de servicios
        } catch (error) {
            alert(`Error al detener ${serviceName}: ${error.message}`);
        }
    };

    // Cargar servicios al iniciar
    loadServices();
});

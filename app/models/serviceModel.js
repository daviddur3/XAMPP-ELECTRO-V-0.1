const fs = require('fs');
const path = require('path');

class ServiceModel {
    constructor() {
        this.servicesFilePath = path.join(__dirname, '../../app/config/services.json');
    }

    getAllServices() {
        try {
            const rawData = fs.readFileSync(this.servicesFilePath);
            const parsedData = JSON.parse(rawData);
            return parsedData.services || [];
        } catch (error) {
            console.error('Error leyendo servicios:', error);
            return [];
        }
    }

    updateServiceStatus(serviceName, status) {
        try {
            const rawData = fs.readFileSync(this.servicesFilePath);
            const fullConfig = JSON.parse(rawData);
            const services = fullConfig.services;
            const serviceIndex = services.findIndex(s => s.name === serviceName);

            if (serviceIndex === -1) {
                throw new Error('Servicio no encontrado');
            }

            services[serviceIndex].status = status;
            fullConfig.metadata.lastUpdated = new Date().toISOString().split('T')[0];

            fs.writeFileSync(
                this.servicesFilePath, 
                JSON.stringify(fullConfig, null, 2)
            );

            return services[serviceIndex];
        } catch (error) {
            console.error('Error actualizando estado de servicio:', error);
            throw error;
        }
    }

    findServiceByName(serviceName) {
        const services = this.getAllServices();
        return services.find(service => 
            service.name.toLowerCase() === serviceName.toLowerCase()
        );
    }

    findServiceById(serviceId) {
        const services = this.getAllServices();
        return services.find(service => service.id === serviceId);
    }

    searchServices(query) {
        const services = this.getAllServices();
        return services.filter(service => 
            service.name.toLowerCase().includes(query.toLowerCase()) ||
            service.type.toLowerCase().includes(query.toLowerCase())
        );
    }

    getPlatformSpecificServiceConfig(serviceName) {
        const service = this.findServiceByName(serviceName);
        const platform = require('os').platform();
        
        if (service && service.platforms) {
            return service.platforms[platform] || null;
        }
        return null;
    }

    updateServiceConfiguration(serviceName, config) {
        const rawData = fs.readFileSync(this.servicesFilePath);
        const fullConfig = JSON.parse(rawData);
        const services = fullConfig.services;

        const serviceIndex = services.findIndex(s => 
            s.name.toLowerCase() === serviceName.toLowerCase()
        );

        if (serviceIndex !== -1) {
            services[serviceIndex] = { 
                ...services[serviceIndex], 
                ...config
            };

            fullConfig.services = services;
            fullConfig.metadata.lastUpdated = new Date().toISOString().split('T')[0];

            fs.writeFileSync(
                this.servicesFilePath, 
                JSON.stringify(fullConfig, null, 2)
            );

            return services[serviceIndex];
        }

        return null;
    }

    getServiceStartCommand(serviceName) {
        const platformConfig = this.getPlatformSpecificServiceConfig(serviceName);
        return platformConfig ? platformConfig.startCommand : null;
    }

    getServiceStopCommand(serviceName) {
        const platformConfig = this.getPlatformSpecificServiceConfig(serviceName);
        return platformConfig ? platformConfig.stopCommand : null;
    }
}

module.exports = new ServiceModel();

const { exec } = require('child_process');
const os = require('os');
const ServiceModel = require('../models/serviceModel');
const LogManager = require('../utils/logManager');

class ServiceController {
    constructor() {
        this.platform = os.platform();
    }

    getServiceCommands(serviceName) {
        const serviceConfig = ServiceModel.findServiceByName(serviceName);
        
        if (serviceConfig && serviceConfig.platforms) {
            const platformCommands = serviceConfig.platforms[this.platform];
            return platformCommands || null;
        }
        
        return null;
    }

    async startService(serviceName) {
        return new Promise((resolve, reject) => {
            const serviceCommands = this.getServiceCommands(serviceName);
            
            if (!serviceCommands || !serviceCommands.startCommand) {
                reject({
                    status: 'error',
                    message: `No se encontró comando de inicio para ${serviceName}`
                });
                return;
            }

            const command = serviceCommands.startCommand;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    LogManager.error(`Error iniciando ${serviceName}`, { 
                        error: error.message,
                        command: command
                    });
                    reject({
                        status: 'error',
                        message: `Error iniciando ${serviceName}: ${error.message}`
                    });
                    return;
                }

                ServiceModel.updateServiceStatus(serviceName, 'running');

                LogManager.info(`Servicio ${serviceName} iniciado correctamente`, { 
                    platform: this.platform 
                });

                resolve({
                    status: 'running',
                    service: serviceName,
                    message: `${serviceName} iniciado correctamente`
                });
            });
        });
    }

    async stopService(serviceName) {
        return new Promise((resolve, reject) => {
            const serviceCommands = this.getServiceCommands(serviceName);
            
            if (!serviceCommands || !serviceCommands.stopCommand) {
                reject({
                    status: 'error',
                    message: `No se encontró comando de detención para ${serviceName}`
                });
                return;
            }

            const command = serviceCommands.stopCommand;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    LogManager.error(`Error deteniendo ${serviceName}`, { 
                        error: error.message,
                        command: command
                    });
                    reject({
                        status: 'error', 
                        message: `Error deteniendo ${serviceName}: ${error.message}`
                    });
                    return;
                }

                ServiceModel.updateServiceStatus(serviceName, 'stopped');

                LogManager.info(`Servicio ${serviceName} detenido correctamente`, { 
                    platform: this.platform 
                });

                resolve({
                    status: 'stopped',
                    service: serviceName,
                    message: `${serviceName} detenido correctamente`
                });
            });
        });
    }

    async getServiceStatus(serviceName) {
        return new Promise((resolve, reject) => {
            const serviceCommands = this.getServiceCommands(serviceName);
            
            if (!serviceCommands || !serviceCommands.statusCommand) {
                reject({
                    status: 'error',
                    message: `No se encontró comando de estado para ${serviceName}`
                });
                return;
            }

            const command = serviceCommands.statusCommand;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    LogManager.error(`Error obteniendo estado de ${serviceName}`, { 
                        error: error.message,
                        command: command
                    });
                    reject(error);
                    return;
                }
                
                const isRunning = stdout.includes('RUNNING') || 
                                   stdout.includes('active') || 
                                   stdout.includes('running');
                
                resolve({
                    service: serviceName,
                    status: isRunning ? 'running' : 'stopped',
                    details: stdout
                });
            });
        });
    }

    listAvailableServices() {
        const services = ServiceModel.getAllServices();
        return services.map(service => ({
            id: service.id,
            name: service.name,
            type: service.type,
            description: service.type === 'webServer' 
                ? 'Servidor Web' 
                : 'Base de Datos',
            status: service.status,
            defaultPort: service.defaultPort
        }));
    }

    findServiceByName(name) {
        return ServiceModel.findServiceByName(name);
    }

    configureService(serviceName, config) {
        return ServiceModel.updateServiceConfiguration(serviceName, config);
    }
}

module.exports = new ServiceController();

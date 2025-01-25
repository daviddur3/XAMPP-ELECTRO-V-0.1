const ServiceModel = require('../app/models/serviceModel');
const fs = require('fs');
const path = require('path');

describe('ServiceModel', () => {
    const testServicesFilePath = path.join(__dirname, '../config/services.test.json');

    beforeEach(() => {
        // Crear un archivo de prueba temporal con datos iniciales
        const initialServices = [
            {
                name: 'Apache',
                type: 'web',
                status: 'stopped',
                port: 80,
                description: 'Servidor Web Apache'
            },
            {
                name: 'MySQL',
                type: 'database',
                status: 'stopped', 
                port: 3306,
                description: 'Servidor de Base de Datos MySQL'
            }
        ];

        fs.writeFileSync(testServicesFilePath, JSON.stringify(initialServices, null, 2));
    });

    afterEach(() => {
        // Eliminar el archivo de prueba después de cada test
        if (fs.existsSync(testServicesFilePath)) {
            fs.unlinkSync(testServicesFilePath);
        }
    });

    describe('Gestión de servicios', () => {
        it('debe obtener todos los servicios', () => {
            const services = ServiceModel.getAllServices();
            
            expect(Array.isArray(services)).toBe(true);
            expect(services.length).toBeGreaterThan(0);
        });

        it('debe actualizar el estado de un servicio', () => {
            const updatedService = ServiceModel.updateServiceStatus('Apache', 'running');

            expect(updatedService.status).toBe('running');
            expect(updatedService).toHaveProperty('lastUpdated');
        });

        it('debe encontrar un servicio por nombre', () => {
            const service = ServiceModel.findServiceByName('MySQL');

            expect(service).toBeTruthy();
            expect(service.name).toBe('MySQL');
        });

        it('debe buscar servicios por consulta', () => {
            const results = ServiceModel.searchServices('web');

            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBeGreaterThan(0);
            results.forEach(result => {
                expect(result.type).toBe('web');
            });
        });
    });

    describe('Validaciones de servicios', () => {
        it('debe manejar búsqueda de servicio inexistente', () => {
            const service = ServiceModel.findServiceByName('NoExistentService');
            
            expect(service).toBeUndefined();
        });

        it('debe manejar actualización de servicio inexistente', () => {
            expect(() => {
                ServiceModel.updateServiceStatus('NoExistentService', 'running');
            }).toThrow();
        });
    });
});

const ServiceController = require('../app/controllers/serviceController');
const ServiceModel = require('../app/models/serviceModel');

describe('ServiceController', () => {
    beforeEach(() => {
        // Configuración inicial antes de cada prueba
        jest.clearAllMocks();
    });

    describe('Métodos de gestión de servicios', () => {
        it('debe iniciar un servicio correctamente', async () => {
            const mockStartResult = {
                status: 'running',
                service: 'Apache',
                message: 'Apache iniciado correctamente'
            };

            const startServiceSpy = jest.spyOn(ServiceController, 'startService')
                .mockResolvedValue(mockStartResult);

            const result = await ServiceController.startService('Apache');

            expect(result).toEqual(mockStartResult);
            expect(startServiceSpy).toHaveBeenCalledWith('Apache');
        });

        it('debe detener un servicio correctamente', async () => {
            const mockStopResult = {
                status: 'stopped',
                service: 'MySQL',
                message: 'MySQL detenido correctamente'
            };

            const stopServiceSpy = jest.spyOn(ServiceController, 'stopService')
                .mockResolvedValue(mockStopResult);

            const result = await ServiceController.stopService('MySQL');

            expect(result).toEqual(mockStopResult);
            expect(stopServiceSpy).toHaveBeenCalledWith('MySQL');
        });
    });

    describe('Verificación de estado de servicios', () => {
        it('debe obtener el estado de un servicio', async () => {
            const mockStatusResult = {
                service: 'Apache',
                status: 'running',
                details: 'Servicio Apache en ejecución'
            };

            const getStatusSpy = jest.spyOn(ServiceController, 'getServiceStatus')
                .mockResolvedValue(mockStatusResult);

            const result = await ServiceController.getServiceStatus('Apache');

            expect(result).toEqual(mockStatusResult);
            expect(getStatusSpy).toHaveBeenCalledWith('Apache');
        });
    });

    describe('Listado de servicios', () => {
        it('debe listar servicios disponibles', () => {
            const services = ServiceController.listAvailableServices();

            expect(Array.isArray(services)).toBe(true);
            expect(services.length).toBeGreaterThan(0);
            
            services.forEach(service => {
                expect(service).toHaveProperty('name');
                expect(service).toHaveProperty('description');
            });
        });
    });
});

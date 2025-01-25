const SystemController = require('../app/controllers/systemController');
const SystemDetector = require('../app/utils/systemDetector');

describe('SystemController', () => {
    describe('Información del sistema', () => {
        it('debe obtener información detallada del sistema', () => {
            const systemInfo = SystemController.getSystemInfo();

            expect(systemInfo).toHaveProperty('platform');
            expect(systemInfo).toHaveProperty('resources');
            expect(systemInfo).toHaveProperty('networkInterfaces');
        });
    });

    describe('Gestión de recursos', () => {
        it('debe verificar disponibilidad de recursos', () => {
            const resourceCheck = SystemController.checkSystemResources();

            expect(resourceCheck).toHaveProperty('cpu');
            expect(resourceCheck).toHaveProperty('memory');
            expect(resourceCheck).toHaveProperty('disk');
        });
    });

    describe('Monitoreo de sistema', () => {
        it('debe obtener métricas de rendimiento', () => {
            const performanceMetrics = SystemController.getPerformanceMetrics();

            expect(performanceMetrics).toHaveProperty('cpuUsage');
            expect(performanceMetrics).toHaveProperty('memoryUsage');
            expect(performanceMetrics).toHaveProperty('processCount');
        });
    });
});

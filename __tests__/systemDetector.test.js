const SystemDetector = require('../app/utils/systemDetector');
const os = require('os');

describe('SystemDetector', () => {
    describe('Detección de plataforma', () => {
        it('debe obtener información de la plataforma', () => {
            const platform = SystemDetector.getPlatform();

            expect(platform).toHaveProperty('type');
            expect(platform).toHaveProperty('arch');
            expect(platform).toHaveProperty('release');
            expect(platform).toHaveProperty('hostname');
        });
    });

    describe('Verificación de puertos', () => {
        it('debe verificar disponibilidad de puerto', async () => {
            const port = 3000; // Puerto de prueba
            const isAvailable = await SystemDetector.checkPortAvailability(port);

            expect(typeof isAvailable).toBe('boolean');
        });
    });

    describe('Recursos del sistema', () => {
        it('debe obtener recursos del sistema', () => {
            const resources = SystemDetector.getSystemResources();

            expect(resources).toHaveProperty('cpus');
            expect(resources).toHaveProperty('totalMemory');
            expect(resources).toHaveProperty('freeMemory');
            expect(resources).toHaveProperty('networkInterfaces');
        });
    });
});

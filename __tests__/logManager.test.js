const LogManager = require('../app/utils/logManager');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('LogManager', () => {
    const logDirectory = path.join(os.homedir(), 'WebServicesManager', 'logs');

    beforeEach(() => {
        // Asegurar que el directorio de logs exista
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }
    });

    describe('Registro de logs', () => {
        it('debe registrar un log de información', () => {
            const infoSpy = jest.spyOn(LogManager.logger, 'info');
            
            LogManager.info('Mensaje de prueba', { data: 'test' });
            
            expect(infoSpy).toHaveBeenCalledWith('Mensaje de prueba', { data: 'test' });
        });

        it('debe registrar un log de error', () => {
            const errorSpy = jest.spyOn(LogManager.logger, 'error');
            
            LogManager.error('Error de prueba', { error: 'test error' });
            
            expect(errorSpy).toHaveBeenCalledWith('Error de prueba', { error: 'test error' });
        });
    });

    describe('Exportación de logs', () => {
        it('debe exportar logs en un rango de fechas', async () => {
            const startDate = new Date('2025-01-01');
            const endDate = new Date('2025-01-31');

            const exportedLogs = await LogManager.exportLogs(startDate, endDate);

            expect(Array.isArray(exportedLogs)).toBe(true);
        });
    });

    describe('Eventos del sistema', () => {
        it('debe registrar un evento del sistema', () => {
            const infoSpy = jest.spyOn(LogManager.logger, 'info');
            
            LogManager.logSystemEvent('Inicio de servicio', { servicio: 'Apache' });
            
            expect(infoSpy).toHaveBeenCalledWith(
                expect.stringContaining('System Event: Inicio de servicio'), 
                { details: { servicio: 'Apache' } }
            );
        });
    });
});

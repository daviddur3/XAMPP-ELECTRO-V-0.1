const LogController = require('../app/controllers/logController');
const LogManager = require('../app/utils/logManager');

describe('LogController', () => {
    describe('Registro de logs', () => {
        it('debe registrar un log de información', () => {
            const infoSpy = jest.spyOn(LogManager, 'info');
            
            LogController.logInfo('Mensaje de prueba', { data: 'test' });
            
            expect(infoSpy).toHaveBeenCalledWith('Mensaje de prueba', { data: 'test' });
        });

        it('debe registrar un log de error', () => {
            const errorSpy = jest.spyOn(LogManager, 'error');
            
            LogController.logError('Error de prueba', { error: 'test error' });
            
            expect(errorSpy).toHaveBeenCalledWith('Error de prueba', { error: 'test error' });
        });
    });

    describe('Exportación de logs', () => {
        it('debe exportar logs en un rango de fechas', async () => {
            const startDate = new Date('2025-01-01');
            const endDate = new Date('2025-01-31');

            const exportedLogs = await LogController.exportLogs(startDate, endDate);

            expect(Array.isArray(exportedLogs)).toBe(true);
        });
    });

    describe('Eventos del sistema', () => {
        it('debe registrar un evento del sistema', () => {
            const systemEventSpy = jest.spyOn(LogManager, 'logSystemEvent');
            
            LogController.logSystemEvent('Inicio de servicio', { servicio: 'Apache' });
            
            expect(systemEventSpy).toHaveBeenCalledWith('Inicio de servicio', { servicio: 'Apache' });
        });
    });
});

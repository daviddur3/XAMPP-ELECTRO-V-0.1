const winston = require('winston');
const path = require('path');
const os = require('os');

class LogManager {
    constructor() {
        this.logDirectory = path.join(os.homedir(), 'WebServicesManager', 'logs');
        this.createLogDirectory();
        this.logger = this.configureLogger();
    }

    createLogDirectory() {
        const fs = require('fs');
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory, { recursive: true });
        }
    }

    configureLogger() {
        return winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.simple()
                }),
                new winston.transports.File({ 
                    filename: path.join(this.logDirectory, 'app.log'),
                    maxsize: 5242880, // 5MB
                    maxFiles: 5
                }),
                new winston.transports.File({ 
                    filename: path.join(this.logDirectory, 'error.log'), 
                    level: 'error',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5
                })
            ]
        });
    }

    info(message, metadata = {}) {
        this.logger.info(message, metadata);
    }

    error(message, metadata = {}) {
        this.logger.error(message, metadata);
    }

    warn(message, metadata = {}) {
        this.logger.warn(message, metadata);
    }

    debug(message, metadata = {}) {
        this.logger.debug(message, metadata);
    }

    logSystemEvent(eventType, details) {
        this.logger.info(`System Event: ${eventType}`, { details });
    }

    async exportLogs(startDate, endDate) {
        // Método para exportar logs en un rango de fechas
        const fs = require('fs').promises;
        const logFilePath = path.join(this.logDirectory, 'app.log');
        
        try {
            const logContents = await fs.readFile(logFilePath, 'utf-8');
            const filteredLogs = logContents
                .split('\n')
                .filter(log => {
                    try {
                        const logEntry = JSON.parse(log);
                        const logDate = new Date(logEntry.timestamp);
                        return logDate >= startDate && logDate <= endDate;
                    } catch {
                        return false;
                    }
                });

            return filteredLogs;
        } catch (error) {
            this.error('Error exportando logs', { error });
            return [];
        }
    }
}

module.exports = new LogManager();

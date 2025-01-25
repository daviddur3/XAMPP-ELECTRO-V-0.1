const os = require('os');
const DeviceDetector = require('device-detector-js');

class SystemDetector {
    constructor() {
        this.deviceDetector = new DeviceDetector();
    }

    getPlatform() {
        return {
            type: process.platform,
            arch: os.arch(),
            release: os.release(),
            hostname: os.hostname()
        };
    }

    detectDevice(userAgent) {
        try {
            return this.deviceDetector.parse(userAgent);
        } catch (error) {
            console.error('Error detecting device:', error);
            return null;
        }
    }

    checkPortAvailability(port) {
        return new Promise((resolve, reject) => {
            const net = require('net');
            const server = net.createServer();

            server.listen(port, () => {
                server.close();
                resolve(true);
            });

            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(false);
                } else {
                    reject(err);
                }
            });
        });
    }

    getSystemResources() {
        return {
            cpus: os.cpus(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            networkInterfaces: os.networkInterfaces()
        };
    }
}

module.exports = new SystemDetector();

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class PHPController {
    constructor() {
        this.phpVersionsPath = path.join(__dirname, '../config/php-versions.json');
    }

    getInstalledVersions() {
        return new Promise((resolve, reject) => {
            const command = 'php -v';
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                const versionMatch = stdout.match(/PHP (\d+\.\d+\.\d+)/);
                if (versionMatch) {
                    resolve([versionMatch[1]]);
                } else {
                    resolve([]);
                }
            });
        });
    }

    switchVersion(version) {
        return new Promise((resolve, reject) => {
            // Lógica para cambiar versión de PHP
            // Esto puede variar según la plataforma
            const command = `update-alternatives --set php /usr/bin/php${version}`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve({ 
                    success: true, 
                    message: `Cambiado a PHP ${version}` 
                });
            });
        });
    }

    installExtension(extensionName) {
        return new Promise((resolve, reject) => {
            const command = `pecl install ${extensionName}`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve({ 
                    success: true, 
                    message: `Extensión ${extensionName} instalada` 
                });
            });
        });
    }

    listExtensions() {
        return new Promise((resolve, reject) => {
            const command = 'php -m';
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                const extensions = stdout
                    .split('\n')
                    .filter(ext => ext && ext.trim() !== '');
                
                resolve(extensions);
            });
        });
    }
}

module.exports = new PHPController();

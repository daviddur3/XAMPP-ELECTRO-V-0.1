const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class FileManager {
    constructor() {
        this.homeDirectory = os.homedir();
    }

    async readDirectory(directoryPath = this.homeDirectory) {
        try {
            const files = await fs.readdir(directoryPath, { withFileTypes: true });
            return files.map(file => ({
                name: file.name,
                type: file.isDirectory() ? 'directory' : 'file',
                extension: path.extname(file.name)
            }));
        } catch (error) {
            console.error('Error reading directory:', error);
            throw error;
        }
    }

    async createFile(filePath, content = '') {
        try {
            await fs.writeFile(filePath, content);
            return { status: 'success', message: `Archivo ${filePath} creado` };
        } catch (error) {
            console.error('Error creando archivo:', error);
            throw error;
        }
    }

    async deleteFile(filePath) {
        try {
            await fs.unlink(filePath);
            return { status: 'success', message: `Archivo ${filePath} eliminado` };
        } catch (error) {
            console.error('Error eliminando archivo:', error);
            throw error;
        }
    }

    async copyFile(sourcePath, destinationPath) {
        try {
            await fs.copyFile(sourcePath, destinationPath);
            return { 
                status: 'success', 
                message: `Archivo copiado de ${sourcePath} a ${destinationPath}` 
            };
        } catch (error) {
            console.error('Error copiando archivo:', error);
            throw error;
        }
    }

    async moveFile(sourcePath, destinationPath) {
        try {
            await fs.rename(sourcePath, destinationPath);
            return { 
                status: 'success', 
                message: `Archivo movido de ${sourcePath} a ${destinationPath}` 
            };
        } catch (error) {
            console.error('Error moviendo archivo:', error);
            throw error;
        }
    }

    async getFileInfo(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                isDirectory: stats.isDirectory(),
                isFile: stats.isFile()
            };
        } catch (error) {
            console.error('Error obteniendo información de archivo:', error);
            throw error;
        }
    }
}

module.exports = new FileManager();

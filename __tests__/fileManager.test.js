const FileManager = require('../app/utils/fileManager');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

describe('FileManager', () => {
    const testDir = path.join(os.tmpdir(), 'fileManagerTest');
    const testFile = path.join(testDir, 'testfile.txt');

    beforeEach(async () => {
        // Crear directorio de pruebas
        await fs.mkdir(testDir, { recursive: true });
    });

    afterEach(async () => {
        // Limpiar directorio de pruebas
        await fs.rm(testDir, { recursive: true, force: true });
    });

    describe('Lectura de directorios', () => {
        it('debe listar contenido de directorio', async () => {
            const files = await FileManager.readDirectory(testDir);
            expect(Array.isArray(files)).toBe(true);
        });
    });

    describe('Operaciones de archivos', () => {
        it('debe crear un archivo', async () => {
            const result = await FileManager.createFile(testFile, 'Test content');
            
            expect(result.status).toBe('success');
            const fileExists = await fs.access(testFile).then(() => true).catch(() => false);
            expect(fileExists).toBe(true);
        });

        it('debe copiar un archivo', async () => {
            const destinationFile = path.join(testDir, 'copiedfile.txt');
            
            await FileManager.createFile(testFile, 'Test content');
            const result = await FileManager.copyFile(testFile, destinationFile);

            expect(result.status).toBe('success');
            const fileExists = await fs.access(destinationFile).then(() => true).catch(() => false);
            expect(fileExists).toBe(true);
        });
    });

    describe('Información de archivos', () => {
        it('debe obtener información de un archivo', async () => {
            await FileManager.createFile(testFile, 'Test content');
            const fileInfo = await FileManager.getFileInfo(testFile);

            expect(fileInfo).toHaveProperty('size');
            expect(fileInfo).toHaveProperty('created');
            expect(fileInfo).toHaveProperty('modified');
            expect(fileInfo).toHaveProperty('isDirectory');
            expect(fileInfo).toHaveProperty('isFile');
        });
    });
});

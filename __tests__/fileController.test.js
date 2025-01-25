const FileController = require('../app/controllers/fileController');
const FileManager = require('../app/utils/fileManager');
const path = require('path');
const os = require('os');

describe('FileController', () => {
    const testDir = path.join(os.tmpdir(), 'fileControllerTest');

    beforeEach(() => {
        // Crear directorio de pruebas
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
    });

    afterEach(() => {
        // Limpiar directorio de pruebas
        fs.rmSync(testDir, { recursive: true, force: true });
    });

    describe('Operaciones de archivos', () => {
        it('debe crear un archivo', async () => {
            const filePath = path.join(testDir, 'testfile.txt');
            const result = await FileController.createFile(filePath, 'Test content');

            expect(result.status).toBe('success');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe copiar un archivo', async () => {
            const sourceFile = path.join(testDir, 'source.txt');
            const destFile = path.join(testDir, 'destination.txt');

            await FileController.createFile(sourceFile, 'Original content');
            const result = await FileController.copyFile(sourceFile, destFile);

            expect(result.status).toBe('success');
            expect(fs.existsSync(destFile)).toBe(true);
        });
    });

    describe('Gestión de directorios', () => {
        it('debe listar contenido de directorio', async () => {
            const files = await FileController.listDirectory(testDir);

            expect(Array.isArray(files)).toBe(true);
        });
    });

    describe('Información de archivos', () => {
        it('debe obtener información de archivo', async () => {
            const filePath = path.join(testDir, 'infofile.txt');
            await FileController.createFile(filePath, 'Test content');

            const fileInfo = await FileController.getFileInfo(filePath);

            expect(fileInfo).toHaveProperty('size');
            expect(fileInfo).toHaveProperty('created');
            expect(fileInfo).toHaveProperty('modified');
        });
    });
});

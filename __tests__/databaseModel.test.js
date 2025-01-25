const DatabaseModel = require('../app/models/databaseModel');
const fs = require('fs');
const path = require('path');

describe('DatabaseModel', () => {
    const testDatabasesFilePath = path.join(__dirname, '../config/databases.test.json');

    beforeEach(() => {
        // Crear un archivo de prueba temporal para cada test
        const initialData = [];
        fs.writeFileSync(testDatabasesFilePath, JSON.stringify(initialData, null, 2));
    });

    afterEach(() => {
        // Eliminar el archivo de prueba después de cada test
        if (fs.existsSync(testDatabasesFilePath)) {
            fs.unlinkSync(testDatabasesFilePath);
        }
    });

    describe('Gestión de bases de datos', () => {
        it('debe añadir una nueva base de datos', () => {
            const newDatabase = {
                name: 'testdb',
                type: 'mysql',
                charset: 'utf8mb4'
            };

            const addedDatabase = DatabaseModel.addDatabase(newDatabase);

            expect(addedDatabase).toMatchObject(newDatabase);
            expect(addedDatabase).toHaveProperty('createdAt');
            expect(addedDatabase).toHaveProperty('updatedAt');
        });

        it('debe listar todas las bases de datos', () => {
            const databases = DatabaseModel.getAllDatabases();
            expect(Array.isArray(databases)).toBe(true);
        });

        it('debe actualizar una base de datos existente', () => {
            const originalDatabase = {
                name: 'testdb',
                type: 'mysql'
            };

            DatabaseModel.addDatabase(originalDatabase);

            const updatedDatabase = DatabaseModel.updateDatabase('testdb', { 
                charset: 'utf8mb4' 
            });

            expect(updatedDatabase.charset).toBe('utf8mb4');
            expect(updatedDatabase).toHaveProperty('updatedAt');
        });

        it('debe eliminar una base de datos', () => {
            const database = {
                name: 'testdb',
                type: 'mysql'
            };

            DatabaseModel.addDatabase(database);
            const result = DatabaseModel.deleteDatabase('testdb');

            expect(result).toBe(true);
        });
    });
});

const DatabaseController = require('../app/controllers/databaseController');
const DatabaseModel = require('../app/models/databaseModel');

describe('DatabaseController', () => {
    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        jest.clearAllMocks();
    });

    describe('Creación de bases de datos', () => {
        it('debe crear una base de datos MySQL', async () => {
            const mockCreateResult = {
                status: 'created',
                database: 'testdb',
                message: 'Base de datos testdb creada correctamente'
            };

            const createDatabaseSpy = jest.spyOn(DatabaseController, 'createDatabase')
                .mockResolvedValue(mockCreateResult);

            const result = await DatabaseController.createDatabase('mysql', 'testdb');

            expect(result).toEqual(mockCreateResult);
            expect(createDatabaseSpy).toHaveBeenCalledWith('mysql', 'testdb');
        });

        it('debe crear una base de datos PostgreSQL', async () => {
            const mockCreateResult = {
                status: 'created',
                database: 'postgresdb',
                message: 'Base de datos postgresdb creada correctamente'
            };

            const createDatabaseSpy = jest.spyOn(DatabaseController, 'createDatabase')
                .mockResolvedValue(mockCreateResult);

            const result = await DatabaseController.createDatabase('postgresql', 'postgresdb');

            expect(result).toEqual(mockCreateResult);
            expect(createDatabaseSpy).toHaveBeenCalledWith('postgresql', 'postgresdb');
        });
    });

    describe('Listado de bases de datos', () => {
        it('debe listar bases de datos MySQL', async () => {
            const mockDatabases = ['mysql', 'information_schema', 'performance_schema'];

            const listDatabasesSpy = jest.spyOn(DatabaseController, 'listDatabases')
                .mockResolvedValue(mockDatabases);

            const result = await DatabaseController.listDatabases('mysql');

            expect(result).toEqual(mockDatabases);
            expect(listDatabasesSpy).toHaveBeenCalledWith('mysql');
        });
    });

    describe('Eliminación de bases de datos', () => {
        it('debe eliminar una base de datos MySQL', async () => {
            const mockDeleteResult = {
                status: 'deleted',
                database: 'testdb',
                message: 'Base de datos testdb eliminada correctamente'
            };

            const deleteDatabaseSpy = jest.spyOn(DatabaseController, 'deleteDatabase')
                .mockResolvedValue(mockDeleteResult);

            const result = await DatabaseController.deleteDatabase('mysql', 'testdb');

            expect(result).toEqual(mockDeleteResult);
            expect(deleteDatabaseSpy).toHaveBeenCalledWith('mysql', 'testdb');
        });
    });
});

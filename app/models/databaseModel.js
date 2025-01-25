const fs = require('fs');
const path = require('path');

class DatabaseModel {
    constructor() {
        this.databasesFilePath = path.join(__dirname, '../../config/databases.json');
        this.ensureDatabasesFileExists();
    }

    ensureDatabasesFileExists() {
        if (!fs.existsSync(this.databasesFilePath)) {
            fs.writeFileSync(this.databasesFilePath, JSON.stringify([], null, 2));
        }
    }

    getAllDatabases() {
        try {
            const rawData = fs.readFileSync(this.databasesFilePath);
            return JSON.parse(rawData);
        } catch (error) {
            console.error('Error leyendo bases de datos:', error);
            return [];
        }
    }

    addDatabase(database) {
        try {
            const databases = this.getAllDatabases();
            
            // Verificar si la base de datos ya existe
            const existingDatabase = databases.find(db => 
                db.name === database.name && db.type === database.type
            );

            if (existingDatabase) {
                throw new Error('La base de datos ya existe');
            }

            // Añadir marca de tiempo
            database.createdAt = new Date().toISOString();
            database.updatedAt = new Date().toISOString();

            databases.push(database);
            
            fs.writeFileSync(this.databasesFilePath, JSON.stringify(databases, null, 2));
            return database;
        } catch (error) {
            console.error('Error añadiendo base de datos:', error);
            throw error;
        }
    }

    updateDatabase(databaseName, updatedData) {
        try {
            const databases = this.getAllDatabases();
            const databaseIndex = databases.findIndex(db => db.name === databaseName);

            if (databaseIndex === -1) {
                throw new Error('Base de datos no encontrada');
            }

            databases[databaseIndex] = {
                ...databases[databaseIndex],
                ...updatedData,
                updatedAt: new Date().toISOString()
            };

            fs.writeFileSync(this.databasesFilePath, JSON.stringify(databases, null, 2));
            return databases[databaseIndex];
        } catch (error) {
            console.error('Error actualizando base de datos:', error);
            throw error;
        }
    }

    deleteDatabase(databaseName) {
        try {
            const databases = this.getAllDatabases();
            const filteredDatabases = databases.filter(db => db.name !== databaseName);

            if (databases.length === filteredDatabases.length) {
                throw new Error('Base de datos no encontrada');
            }

            fs.writeFileSync(this.databasesFilePath, JSON.stringify(filteredDatabases, null, 2));
            return true;
        } catch (error) {
            console.error('Error eliminando base de datos:', error);
            throw error;
        }
    }

    findDatabaseByName(databaseName) {
        const databases = this.getAllDatabases();
        return databases.find(db => db.name === databaseName);
    }

    searchDatabases(query) {
        const databases = this.getAllDatabases();
        return databases.filter(database => 
            database.name.toLowerCase().includes(query.toLowerCase()) ||
            database.type.toLowerCase().includes(query.toLowerCase())
        );
    }
}

module.exports = new DatabaseModel();

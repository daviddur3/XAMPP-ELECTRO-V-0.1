const { exec } = require('child_process');
const os = require('os');

class DatabaseController {
    constructor() {
        this.platform = os.platform();
    }

    generateCreateDatabaseCommand(type, name, charset = 'utf8', collation = 'utf8_general_ci') {
        const commandTemplates = {
            mysql: `mysql -u root -e "CREATE DATABASE IF NOT EXISTS ${name} 
                    CHARACTER SET ${charset} 
                    COLLATE ${collation}"`,
            postgresql: `psql -c "CREATE DATABASE ${name} 
                         ENCODING '${charset}'"`
        };

        return commandTemplates[type];
    }

    async createDatabase(type, name, charset = null, collation = null) {
        return new Promise((resolve, reject) => {
            const command = this.generateCreateDatabaseCommand(type, name, charset, collation);

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject({
                        status: 'error',
                        message: `Error creando base de datos ${name}: ${error.message}`
                    });
                    return;
                }

                resolve({
                    status: 'created',
                    database: name,
                    message: `Base de datos ${name} creada correctamente`
                });
            });
        });
    }

    async listDatabases(type) {
        return new Promise((resolve, reject) => {
            const commands = {
                mysql: 'mysql -u root -e "SHOW DATABASES"',
                postgresql: 'psql -l'
            };

            exec(commands[type], (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }

                const databases = stdout
                    .trim()
                    .split('\n')
                    .filter(db => 
                        db && 
                        db.trim() !== '' && 
                        !db.includes('Databases:') && 
                        !db.includes('---') &&
                        !db.match(/^\+|-+$/)
                    )
                    .map(db => db.trim());

                resolve(databases);
            });
        });
    }

    async deleteDatabase(type, name) {
        return new Promise((resolve, reject) => {
            const commands = {
                mysql: `mysql -u root -e "DROP DATABASE IF EXISTS ${name}"`,
                postgresql: `psql -c "DROP DATABASE IF EXISTS ${name}"`
            };

            exec(commands[type], (error, stdout, stderr) => {
                if (error) {
                    reject({
                        status: 'error',
                        message: `Error eliminando base de datos ${name}: ${error.message}`
                    });
                    return;
                }

                resolve({
                    status: 'deleted',
                    database: name,
                    message: `Base de datos ${name} eliminada correctamente`
                });
            });
        });
    }
}

module.exports = new DatabaseController();

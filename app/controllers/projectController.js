const fs = require('fs');
const path = require('path');
const os = require('os');

class ProjectController {
    constructor() {
        this.projectsDirectory = path.join(os.homedir(), 'WebServicesProjects');
        
        // Crear directorio de proyectos si no existe
        if (!fs.existsSync(this.projectsDirectory)) {
            fs.mkdirSync(this.projectsDirectory, { recursive: true });
        }
    }

    createProject(type, name) {
        const projectPath = path.join(this.projectsDirectory, name);

        try {
            // Crear directorio del proyecto
            fs.mkdirSync(projectPath, { recursive: true });

            // Configuraciones según tipo de proyecto
            const projectConfigs = {
                nodejs: this.createNodeJSProject,
                php: this.createPHPProject,
                python: this.createPythonProject
            };

            const createProjectFunc = projectConfigs[type.toLowerCase()];
            
            if (createProjectFunc) {
                createProjectFunc(projectPath, name);
            }

            return {
                status: 'success',
                message: `Proyecto ${name} creado correctamente`,
                path: projectPath
            };
        } catch (error) {
            return {
                status: 'error',
                message: `Error creando proyecto: ${error.message}`
            };
        }
    }

    createNodeJSProject(projectPath, name) {
        // Estructura básica de proyecto Node.js
        const packageJson = {
            name: name,
            version: '1.0.0',
            description: 'Proyecto Node.js generado automáticamente',
            main: 'index.js',
            scripts: {
                start: 'node index.js',
                dev: 'nodemon index.js'
            }
        };

        fs.writeFileSync(
            path.join(projectPath, 'package.json'), 
            JSON.stringify(packageJson, null, 2)
        );
        
        fs.writeFileSync(
            path.join(projectPath, 'index.js'), 
            '// Proyecto Node.js ' + name + '\nconsole.log("Proyecto iniciado");'
        );

        fs.writeFileSync(
            path.join(projectPath, 'README.md'), 
            `# ${name}\n\nProyecto Node.js generado automáticamente`
        );
    }

    createPHPProject(projectPath, name) {
        // Estructura básica de proyecto PHP
        fs.writeFileSync(
            path.join(projectPath, 'index.php'), 
            '<?php\n// Proyecto PHP ' + name + '\necho "Proyecto iniciado";'
        );
        
        fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
        fs.mkdirSync(path.join(projectPath, 'public'), { recursive: true });
    }

    createPythonProject(projectPath, name) {
        // Estructura básica de proyecto Python
        fs.writeFileSync(
            path.join(projectPath, 'main.py'), 
            '# Proyecto Python ' + name + '\nprint("Proyecto iniciado")'
        );
        
        fs.writeFileSync(
            path.join(projectPath, 'requirements.txt'), 
            '# Dependencias del proyecto'
        );
    }

    listProjects() {
        try {
            return fs.readdirSync(this.projectsDirectory)
                .filter(file => fs.statSync(path.join(this.projectsDirectory, file)).isDirectory())
                .map(projectName => ({
                    name: projectName,
                    path: path.join(this.projectsDirectory, projectName)
                }));
        } catch (error) {
            console.error('Error listando proyectos:', error);
            return [];
        }
    }

    deleteProject(projectName) {
        const projectPath = path.join(this.projectsDirectory, projectName);

        try {
            // Eliminar directorio del proyecto
            fs.rmSync(projectPath, { recursive: true, force: true });

            return {
                status: 'success',
                message: `Proyecto ${projectName} eliminado correctamente`
            };
        } catch (error) {
            return {
                status: 'error',
                message: `Error eliminando proyecto: ${error.message}`
            };
        }
    }
}

module.exports = new ProjectController();

const ProjectController = require('../app/controllers/projectController');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('ProjectController', () => {
    const testProjectName = 'test-project';
    const projectsBaseDir = path.join(os.homedir(), 'WebServicesProjects');
    const testProjectPath = path.join(projectsBaseDir, testProjectName);

    beforeEach(() => {
        // Limpiar proyectos de prueba antes de cada test
        if (fs.existsSync(testProjectPath)) {
            fs.rmSync(testProjectPath, { recursive: true, force: true });
        }
    });

    describe('Creación de proyectos', () => {
        it('debe crear un proyecto Node.js', () => {
            const result = ProjectController.createProject('nodejs', testProjectName);
            
            expect(result.status).toBe('success');
            expect(fs.existsSync(path.join(testProjectPath, 'package.json'))).toBe(true);
            expect(fs.existsSync(path.join(testProjectPath, 'index.js'))).toBe(true);
        });

        it('debe crear un proyecto PHP', () => {
            const result = ProjectController.createProject('php', testProjectName);
            
            expect(result.status).toBe('success');
            expect(fs.existsSync(path.join(testProjectPath, 'index.php'))).toBe(true);
            expect(fs.existsSync(path.join(testProjectPath, 'src'))).toBe(true);
        });
    });

    describe('Listado de proyectos', () => {
        it('debe listar proyectos existentes', () => {
            const projects = ProjectController.listProjects();
            
            expect(Array.isArray(projects)).toBe(true);
            projects.forEach(project => {
                expect(project).toHaveProperty('name');
                expect(project).toHaveProperty('path');
            });
        });
    });

    describe('Eliminación de proyectos', () => {
        it('debe eliminar un proyecto existente', () => {
            // Crear proyecto primero
            ProjectController.createProject('nodejs', testProjectName);
            
            const result = ProjectController.deleteProject(testProjectName);
            
            expect(result.status).toBe('success');
            expect(fs.existsSync(testProjectPath)).toBe(false);
        });
    });
});

const ProjectModel = require('../app/models/projectModel');
const fs = require('fs');
const path = require('path');

describe('ProjectModel', () => {
    const testProjectsFilePath = path.join(__dirname, '../config/projects.test.json');

    beforeEach(() => {
        // Crear un archivo de prueba temporal para cada test
        const initialData = [];
        fs.writeFileSync(testProjectsFilePath, JSON.stringify(initialData, null, 2));
    });

    afterEach(() => {
        // Eliminar el archivo de prueba después de cada test
        if (fs.existsSync(testProjectsFilePath)) {
            fs.unlinkSync(testProjectsFilePath);
        }
    });

    describe('Gestión de proyectos', () => {
        it('debe añadir un nuevo proyecto', () => {
            const newProject = {
                name: 'testproject',
                type: 'nodejs',
                description: 'Proyecto de prueba'
            };

            const addedProject = ProjectModel.addProject(newProject);

            expect(addedProject).toMatchObject(newProject);
            expect(addedProject).toHaveProperty('createdAt');
            expect(addedProject).toHaveProperty('updatedAt');
        });

        it('debe listar todos los proyectos', () => {
            const projects = ProjectModel.getAllProjects();
            expect(Array.isArray(projects)).toBe(true);
        });

        it('debe actualizar un proyecto existente', () => {
            const originalProject = {
                name: 'testproject',
                type: 'nodejs'
            };

            ProjectModel.addProject(originalProject);

            const updatedProject = ProjectModel.updateProject('testproject', { 
                description: 'Proyecto actualizado' 
            });

            expect(updatedProject.description).toBe('Proyecto actualizado');
            expect(updatedProject).toHaveProperty('updatedAt');
        });

        it('debe eliminar un proyecto', () => {
            const project = {
                name: 'testproject',
                type: 'nodejs'
            };

            ProjectModel.addProject(project);
            const result = ProjectModel.deleteProject('testproject');

            expect(result).toBe(true);
        });
    });
});

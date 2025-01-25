const fs = require('fs');
const path = require('path');

class ProjectModel {
    constructor() {
        this.projectsFilePath = path.join(__dirname, '../../config/projects.json');
        this.ensureProjectsFileExists();
    }

    ensureProjectsFileExists() {
        if (!fs.existsSync(this.projectsFilePath)) {
            fs.writeFileSync(this.projectsFilePath, JSON.stringify([], null, 2));
        }
    }

    getAllProjects() {
        try {
            const rawData = fs.readFileSync(this.projectsFilePath);
            return JSON.parse(rawData);
        } catch (error) {
            console.error('Error leyendo proyectos:', error);
            return [];
        }
    }

    addProject(project) {
        try {
            const projects = this.getAllProjects();
            
            // Verificar si el proyecto ya existe
            const existingProject = projects.find(p => p.name === project.name);
            if (existingProject) {
                throw new Error('El proyecto ya existe');
            }

            // Añadir marca de tiempo
            project.createdAt = new Date().toISOString();
            project.updatedAt = new Date().toISOString();

            projects.push(project);
            
            fs.writeFileSync(this.projectsFilePath, JSON.stringify(projects, null, 2));
            return project;
        } catch (error) {
            console.error('Error añadiendo proyecto:', error);
            throw error;
        }
    }

    updateProject(projectName, updatedData) {
        try {
            const projects = this.getAllProjects();
            const projectIndex = projects.findIndex(p => p.name === projectName);

            if (projectIndex === -1) {
                throw new Error('Proyecto no encontrado');
            }

            projects[projectIndex] = {
                ...projects[projectIndex],
                ...updatedData,
                updatedAt: new Date().toISOString()
            };

            fs.writeFileSync(this.projectsFilePath, JSON.stringify(projects, null, 2));
            return projects[projectIndex];
        } catch (error) {
            console.error('Error actualizando proyecto:', error);
            throw error;
        }
    }

    deleteProject(projectName) {
        try {
            const projects = this.getAllProjects();
            const filteredProjects = projects.filter(p => p.name !== projectName);

            if (projects.length === filteredProjects.length) {
                throw new Error('Proyecto no encontrado');
            }

            fs.writeFileSync(this.projectsFilePath, JSON.stringify(filteredProjects, null, 2));
            return true;
        } catch (error) {
            console.error('Error eliminando proyecto:', error);
            throw error;
        }
    }

    findProjectByName(projectName) {
        const projects = this.getAllProjects();
        return projects.find(p => p.name === projectName);
    }

    searchProjects(query) {
        const projects = this.getAllProjects();
        return projects.filter(project => 
            project.name.toLowerCase().includes(query.toLowerCase()) ||
            project.type.toLowerCase().includes(query.toLowerCase())
        );
    }
}

module.exports = new ProjectModel();

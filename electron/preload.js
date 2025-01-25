const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Métodos de servicios
    selectProjectDirectory: () => ipcRenderer.invoke('select-project-directory'),
    startService: (serviceName) => ipcRenderer.invoke('service:start', serviceName),
    stopService: (serviceName) => ipcRenderer.invoke('service:stop', serviceName),
    getServiceStatus: (serviceName) => ipcRenderer.invoke('service:getStatus', serviceName),
    listServices: () => ipcRenderer.invoke('services:list'),

    // Métodos de proyectos
    createProject: (projectData) => ipcRenderer.invoke('project:create', projectData),
    listProjects: () => ipcRenderer.invoke('project:list'),
    deleteProject: (projectName) => ipcRenderer.invoke('project:delete', projectName),

    // Métodos de bases de datos
    createDatabase: (databaseData) => ipcRenderer.invoke('database:create', databaseData),
    listDatabases: (type) => ipcRenderer.invoke('database:list', type),
    deleteDatabase: (databaseName) => ipcRenderer.invoke('database:delete', databaseName),

    // Métodos de sistema
    detectSystem: () => ipcRenderer.invoke('system:detect'),
    checkPortAvailability: (port) => ipcRenderer.invoke('system:checkPort', port),

    // Métodos de registro y logs
    writeLog: (logData) => ipcRenderer.invoke('log:write', logData),
    readLogs: () => ipcRenderer.invoke('log:read'),

    // Información del sistema
    platform: process.platform,
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },

    // Métodos de configuración
    saveConfig: (config) => ipcRenderer.invoke('config:save', config),
    loadConfig: () => ipcRenderer.invoke('config:load'),

    // Utilidades de archivos
    readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
    writeFile: (filePath, content) => ipcRenderer.invoke('file:write', filePath, content)
});

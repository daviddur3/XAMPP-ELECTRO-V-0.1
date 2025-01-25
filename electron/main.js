const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const express = require('express');
const mysql = require('mysql2');

// Importaciones de controladores y utilidades
const ServiceController = require('../app/controllers/serviceController');
const DatabaseController = require('../app/controllers/databaseController');
const LogManager = require('../app/utils/logManager');

class ElectronApp {
    constructor() {
        this.mainWindow = null;
        this.expressApp = null;
        this.databaseConnection = null;
    }

    createWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1024,
            height: 768,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false
            }
        });

        // Mejoras de seguridad
        this.mainWindow.removeMenu(); // Eliminar menú por defecto
        this.mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

        // Habilitar herramientas de desarrollo solo en modo desarrollo
        if (process.env.NODE_ENV === 'development') {
            this.mainWindow.webContents.openDevTools();
        }
    }

    initWebServer() {
        this.expressApp = express();
        const PORT = process.env.PORT || 3000;

        // Configurar rutas básicas
        this.expressApp.get('/', (req, res) => {
            res.send('Servidor Web Iniciado');
        });

        this.expressApp.listen(PORT, () => {
            console.log(`Servidor web corriendo en puerto ${PORT}`);
            ServiceController.startService('Apache')
                .then(() => {
                    LogManager.info(`Servidor web iniciado en puerto ${PORT}`);
                })
                .catch(error => {
                    LogManager.error('Error iniciando servidor web', { error });
                });
        });
    }

    initDatabase() {
        try {
            this.databaseConnection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'webservicesmanager'
            });

            this.databaseConnection.connect((err) => {
                if (err) {
                    console.error('Error conectando base de datos:', err);
                    ServiceController.stopService('MySQL');
                    LogManager.error('Error conectando base de datos', { error: err });
                    return;
                }
                console.log('Conexión a base de datos establecida');
                ServiceController.startService('MySQL')
                    .then(() => {
                        LogManager.info('Conexión a base de datos establecida');
                    })
                    .catch(error => {
                        LogManager.error('Error iniciando servicio MySQL', { error });
                    });
            });
        } catch (error) {
            console.error('Error inicializando base de datos:', error);
            LogManager.error('Error inicializando base de datos', { error });
        }
    }

    setupIpcHandlers() {
        ipcMain.handle('service:start', async (event, serviceName) => {
            try {
                return await ServiceController.startService(serviceName);
            } catch (error) {
                return { status: 'error', message: error.message };
            }
        });

        ipcMain.handle('service:stop', async (event, serviceName) => {
            try {
                return await ServiceController.stopService(serviceName);
            } catch (error) {
                return { status: 'error', message: error.message };
            }
        });

        ipcMain.handle('service:getStatus', async (event, serviceName) => {
            try {
                return await ServiceController.getServiceStatus(serviceName);
            } catch (error) {
                return { status: 'error', message: error.message };
            }
        });

        ipcMain.handle('services:list', () => {
            return ServiceController.listAvailableServices();
        });

        ipcMain.handle('select-project-directory', async () => {
            const result = await dialog.showOpenDialog({
                properties: ['openDirectory', 'createDirectory']
            });

            return result.filePaths[0] || null;
        });
    }

    init() {
        app.whenReady().then(() => {
            this.createWindow();
            this.initWebServer();
            this.initDatabase();
            this.setupIpcHandlers();

            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    this.createWindow();
                }
            });
        });

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                // Detener servicios antes de salir
                ServiceController.stopService('Apache');
                ServiceController.stopService('MySQL');
                app.quit();
            }
        });
    }
}

const electronApp = new ElectronApp();
electronApp.init();

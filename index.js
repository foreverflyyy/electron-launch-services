const path = require('path');
const { exec } = require('child_process');
const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron');

const getAllServices = require('./utils/getAllServices');
const addSuffixByServiceName = require('./utils/addSuffixByServiceName');
const launchService = require('./utils/launchService');

let mainWindow;
let allServices = {}

app.on('ready', () => {
    const ElectronStore = require('electron-store');
    ElectronStore.initRenderer();

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.send('startWork');
});

// Открыть диалоговое окно и получить путь до файла
ipcMain.on('openFile', (event) => {
    // Диалоговое окно выбора файла
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'All Files', extensions: ['*'] }],
    }).then((result) => {
        if (!result.canceled && result.filePaths.length > 0) {
            const selectedFilePath = result.filePaths[0];
            mainWindow.webContents.send('selectedFilePath', selectedFilePath);
        }
    });
});

// Получить объект с данными из файла
ipcMain.on('fileSelected', (event, selectedFilePath) => {
    try {
        const exportedObject = require(selectedFilePath);
        allServices = getAllServices(exportedObject);
        mainWindow.webContents.send('fileContent', exportedObject);
    } catch (err) {
        console.error('Ошибка при получении списка микросервисов:', err);
    }
});

ipcMain.on('loadService', (event, data) => {
    const { service, statusServices, directory, suffix } = data;
    const allNeedServices = [service.serviceName, ...service.includeServices];

    console.log("loadService", service.serviceName);

    for (const serviceName of allNeedServices) {
        console.log("loadService", serviceName);
        const nameWithSuffix = addSuffixByServiceName(serviceName, suffix);

        if (!statusServices[nameWithSuffix]) {
            const command = allServices[nameWithSuffix].commandByStart;
            launchService(nameWithSuffix, command, directory, mainWindow);
        }
    }
});

ipcMain.on('stopService', (event, serviceName) => {
    console.log("stopService", serviceName);
    exec(`wmctrl -R ${serviceName} && xdotool key --clearmodifiers ctrl+c `);
    mainWindow.webContents.send('changeStatusMicroservice', serviceName, false);
});
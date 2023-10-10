const path = require('path');
const { exec, spawn } = require('child_process');
const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron');

let mainWindow;

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
    mainWindow.webContents.openDevTools();
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

ipcMain.on('fileSelected', (event, selectedFilePath) => {
    // Текущая рабочая директория
    const currentWorkingDirectory = process.cwd();

    // Преобразовать абсолютный путь в относительный
    const relativePathToFile = path.relative(currentWorkingDirectory, selectedFilePath);

    try {
        const exportedObject = require(relativePathToFile);
        mainWindow.webContents.send('fileContent', exportedObject);
    } catch (err) {
        console.error('Ошибка при получении списка микросервисов:', err);
    }
});

ipcMain.on('loadMicroservice', (event, objMicroservice, pathToFileConfig) => {
    const serviceName = objMicroservice.serviceName;
    const commandToRun = `DIST=${serviceName} npm start`;
    const pathToDirectory = path.join(pathToFileConfig, "../");

    exec(`gnome-terminal --working-directory=${pathToDirectory} --title=${objMicroservice.serviceName} -- bash -c "${commandToRun}"`);
    checkByIntervalProcess(objMicroservice);
});

ipcMain.on('stopMicroservice', (event, objMicroservice) => {
    exec(`wmctrl -R ${objMicroservice.serviceName} && xdotool key --clearmodifiers ctrl+c `);
});

const checkByIntervalProcess = (objMicroservice) => {
    const port = objMicroservice.port;
    const serviceName = objMicroservice.serviceName;

    const map = {};
    map.interval = setInterval(() => {
        exec(`lsof -i :${port}`, (error, stdout, stderr) => {
            if (error) {
                mainWindow.webContents.send('changeStatusMicroservice', serviceName, false);
                clearInterval(map.interval);
            }
            if (stderr) {
                mainWindow.webContents.send('changeStatusMicroservice', serviceName, false);
                clearInterval(map.interval)
            }
        });
    }, 1500)
}
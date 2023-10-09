const path = require('path');
const { exec } = require('child_process');
const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.loadFile('index.html');
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
    const currentWorkingDirectory = process.cwd(); // Текущая рабочая директория

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

    const commandToRun = `DIST=${objMicroservice.serviceName} npm start`;
    const pathToDirectory = path.join(pathToFileConfig, "../");

    exec(`gnome-terminal --working-directory=${pathToDirectory} -- bash -c "${commandToRun}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Ошибка выполнения команды: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Ошибка в выводе команды: ${stderr}`);
            return;
        }
        console.log(`Стандартный вывод команды: ${stdout}`);
    });
});
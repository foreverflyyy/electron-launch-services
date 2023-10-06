const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron');
const { spawn } = require('child_process');
const path = require('path');

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
    // Текущая рабочая директория
    const currentWorkingDirectory = process.cwd();
    // Преобразовать абсолютный путь в относительный
    const relativePathToFile = path.relative(currentWorkingDirectory, selectedFilePath);

    console.log('Относительный путь:', relativePathToFile);

    try {
        const exportedObject = require(relativePathToFile);
        console.log('Объект из файла .js:', exportedObject);
    } catch (err) {
        console.error('Ошибка при выполнении кода файла:', err);
    }
});

// Запустить команду для запуска микросервиса
ipcMain.on('startButtonClicked', (event, inputValue) => {
    const directoryPath = inputValue;
    const npmStartProcess = spawn('npm', ['start'], { cwd: directoryPath });

    npmStartProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    npmStartProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    npmStartProcess.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
});

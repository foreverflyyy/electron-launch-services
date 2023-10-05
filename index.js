const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    globalShortcut
} = require('electron')
const path = require('node:path');
const appMenu = require('./scripts/appMenu');
require('./js/index');

getMessage

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
};

app.whenReady().then(() => {
    // Для взаимодействия с Node.js
    ipcMain.handle('ping', () => 'pong');
    createWindow();

    // Глобальные горячие клавиши
    globalShortcut.register('Alt+CommandOrControl+I', () => {
        console.log('Electron loves global shortcuts!')
    })

    // Запуск окна через macOS
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    });

    const template = appMenu();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});
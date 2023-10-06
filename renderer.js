const { ipcRenderer } = require('electron');

let pathToFile = '';
const selectFileButton = document.getElementById('selectFileButton');

const textPathToFile = document.getElementById('pathToFile');
const commandButton = document.getElementById('commandButton');

selectFileButton.addEventListener('click', () => {
    ipcRenderer.send('openFile');
});

commandButton.addEventListener('click', () => {
    ipcRenderer.send('startButtonClicked', pathToFile);
});

ipcRenderer.on('selectedFilePath', (event, selectedFilePath) => {
    pathToFile = selectedFilePath;
    textPathToFile.innerText = selectedFilePath;
    console.log('Выбранный путь к файлу:', selectedFilePath);

    ipcRenderer.send('fileSelected', selectedFilePath);
});

// Добавьте обработчик для получения объекта из файла .js
ipcRenderer.on('fileContent', (event, exportedObject) => {
    // Здесь вы можете использовать объект из файла .js по вашему усмотрению
    console.log('Объект из файла .js:', exportedObject);
    // Теперь вы можете работать с объектом из файла .js
});
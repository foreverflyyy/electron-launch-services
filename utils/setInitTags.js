const {ipcRenderer} = require("electron");

module.exports = () => {
    const body = document.getElementsByTagName('body')[0];

    const titleElement = document.createElement('h3');
    titleElement.id = 'main_title';
    titleElement.innerText = 'Путь до файла services_config_by_electron.js:';

    const pathTextElement = document.createElement('div');
    pathTextElement.id = 'pathToFile';

    const buttonFile = document.createElement('button');
    buttonFile.id = 'selectFileButton';
    buttonFile.innerText = 'Выбрать файл';
    buttonFile.addEventListener('click', () => { ipcRenderer.send('openFile'); });

    const tabsElement = document.createElement('div');
    tabsElement.id = 'tabs';

    body.appendChild(titleElement);
    body.appendChild(pathTextElement);
    body.appendChild(buttonFile);
    body.appendChild(tabsElement);
}
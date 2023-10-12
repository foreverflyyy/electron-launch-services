const { ipcRenderer } = require('electron');
const showSectionOfServices = require('./utils/showSectionOfServices');
const setInitTags = require('./utils/setInitTags');

const Store = require('electron-store');
const store = new Store();

const statusServices = {};

document.addEventListener('DOMContentLoaded', function() {
    setInitTags();
    const path = store.get('filePath');

    if(path)
        showPathAndGetData(path);
});

ipcRenderer.on('selectedFilePath', (event, selectedFilePath) => {
    store.set('filePath', selectedFilePath);
    document.getElementById("tabs").innerHTML = "";

    showPathAndGetData(selectedFilePath);
});

const showPathAndGetData = (path) => {
    document.getElementById('pathToFile').innerText = path;
    ipcRenderer.send('fileSelected', path);
}

ipcRenderer.on('fileContent', (event, exportedObject) => {
    for (const section of exportedObject)
        showSectionOfServices(section, statusServices);
});

ipcRenderer.on('changeStatusMicroservice', (event, serviceName, value) => {
    const serviceSection = document.getElementById(serviceName);

    if(value)
        serviceSection.classList.add('active');
    else
        serviceSection.classList.remove("active");

    statusServices[serviceName] = value;
});
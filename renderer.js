const { ipcRenderer } = require('electron');

const textPathToFile = document.getElementById('pathToFile');
const selectFileButton = document.getElementById('selectFileButton');

selectFileButton.addEventListener('click', () => {
    ipcRenderer.send('openFile');
});

ipcRenderer.on('selectedFilePath', (event, selectedFilePath) => {
    textPathToFile.innerText = selectedFilePath;
    ipcRenderer.send('fileSelected', selectedFilePath);
});

// Добавьте обработчик для получения объекта из файла .js
ipcRenderer.on('fileContent', (event, exportedObject) => {
    const microservicesSection = document.getElementById('microservices');
    const tabsMicroServ = document.getElementById('tabs_microservices');
    tabsMicroServ.style.display = 'block';

    exportedObject.forEach(service => {
        const serviceSection = document.createElement('div');

        serviceSection.addEventListener('click', () => {
            console.log(`You click on microservice - ${service.serviceName}`)
            ipcRenderer.send('loadMicroservice', service);
        });
        serviceSection.innerText = service.serviceName;
        serviceSection.classList.add('microservice');

        microservicesSection.appendChild(serviceSection);
    });
});
const { ipcRenderer } = require('electron');
const Store = require('electron-store');
const store = new Store();

let openPid = {}
let pathToFileConfig = "";

const textPathToFile = document.getElementById('pathToFile');
const selectFileButton = document.getElementById('selectFileButton');

selectFileButton.addEventListener('click', () => {
    ipcRenderer.send('openFile');
});

ipcRenderer.on('startWork', (event) => {
    const path = store.get('filePath');

    if(path)
        showPathAndGetData(path);
});

ipcRenderer.on('selectedFilePath', (event, selectedFilePath) => {
    store.set('filePath', selectedFilePath);
    showPathAndGetData(selectedFilePath);
});

const showPathAndGetData = (path) => {
    textPathToFile.innerText = path;
    pathToFileConfig = path;
    ipcRenderer.send('fileSelected', path);
}

// Добавьте обработчик для получения объекта из файла .js
ipcRenderer.on('fileContent', (event, exportedObject) => {
    const microservicesSection = document.getElementById('microservices');
    const tabsMicroServ = document.getElementById('tabs_microservices');
    tabsMicroServ.style.display = 'block';

    exportedObject.forEach(service => {
        const serviceName = service.serviceName;
        openPid[serviceName] = false;

        const serviceSection = document.createElement('div');
        serviceSection.innerText = service.serviceName;
        serviceSection.classList.add('microservice');
        serviceSection.id = serviceName;

        serviceSection.addEventListener('click', () => {
            if(openPid[service.serviceName]) {
                ipcRenderer.send('stopMicroservice', service);
                changeStatusMicroservice(serviceName, false);
            }
            else {
                ipcRenderer.send('loadMicroservice', service, pathToFileConfig);
                changeStatusMicroservice(serviceName, true);
            }
        });

        microservicesSection.appendChild(serviceSection);
    });
});

const changeStatusMicroservice = (nameMicroservice, value) => {
    const serviceSection = document.getElementById(nameMicroservice);

    if(value)
        serviceSection.classList.add('active');
    else
        serviceSection.classList.remove("active");

    openPid[nameMicroservice] = value;
}

ipcRenderer.on('changeStatusMicroservice', (event, nameMicroservice, value) => {
    changeStatusMicroservice(nameMicroservice, value);
});
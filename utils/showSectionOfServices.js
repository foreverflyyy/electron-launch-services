const {ipcRenderer} = require("electron");
const addSuffixByServiceName = require("./addSuffixByServiceName");

module.exports = (dataOfServices, statusServices) => {
    const suffix = dataOfServices.suffix;
    const tabsSection = document.getElementById("tabs");

    const newTabSection = document.createElement('div');
    tabsSection.appendChild(newTabSection);

    const titleElement = document.createElement('h3');
    titleElement.classList.add('title');
    titleElement.innerText = dataOfServices.title;
    newTabSection.appendChild(titleElement);

    const listElement = document.createElement('div');
    listElement.classList.add('list__cells');
    newTabSection.appendChild(listElement);

    dataOfServices.services.forEach(service => {
        const serviceName = addSuffixByServiceName(service.serviceName, suffix);
        statusServices[serviceName] = false;

        const serviceSection = document.createElement('div');
        serviceSection.innerText = service.serviceName;
        serviceSection.classList.add('cell');
        serviceSection.id = serviceName;

        serviceSection.addEventListener('click', () => {
            if(statusServices[serviceName]) {
                console.log('click break')
                console.log('check')
                ipcRenderer.send('stopService', serviceName);
            }
            else {
                console.log('click load')
                console.log('check')
                ipcRenderer.send('loadService', {
                    service,
                    statusServices,
                    suffix,
                    directory: dataOfServices.workingDirectory
                });
            }
        });

        listElement.appendChild(serviceSection);
    });
}
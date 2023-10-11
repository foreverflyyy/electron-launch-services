const {exec} = require("child_process");

module.exports = (nameWithSuffix, command, directory, mainWindow) => {
    console.log("preCommand", nameWithSuffix)
    exec(`gnome-terminal --working-directory=${directory} --title=${nameWithSuffix} -- bash -c "${command}"`);
    console.log("postCommand", nameWithSuffix)
    mainWindow.webContents.send('changeStatusMicroservice', nameWithSuffix, true);

    checkByIntervalProcess(nameWithSuffix, mainWindow);
}

// Проверка на доступность запущенного терминала
const checkByIntervalProcess = (serviceName, mainWindow) => {
    const map = {};
    map.interval = setInterval(() => {
        console.log("checkInterval", serviceName)
        exec(`wmctrl -l | grep ${serviceName}`, (error) => {
            if (error) {
                mainWindow.webContents.send('changeStatusMicroservice', serviceName, false);
                clearInterval(map.interval);
            }
        });
    }, 1500);
}
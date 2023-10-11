module.exports = (exportedObject) => {
    return exportedObject.reduce((acc, row) => {
        if (!row.services || !row.services.length)
            return acc;

        const suffix = row.suffix;
        const commandByStartDefault = row.commandByStartDefault;

        const services = row.services.reduce((accServices, rowServices) => {
            const nameService = `${rowServices.serviceName}_${suffix}`
            const commandByStart = rowServices.commandByStart ? rowServices.commandByStart : commandByStartDefault.replace('{{SERVICENAME}}', rowServices.serviceName)
            accServices[nameService] = {
                ...rowServices,
                commandByStart: commandByStart
            }
            return  accServices
        },{})

        acc = {
            ...acc,
            ...services
        }
        return acc
    }, {})
}
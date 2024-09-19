const LogsModel = require("./logs.model")

class LogsDAO {

    async addLog(date, user, message) {
        try {
            const newLog = {
                date: date,
                user: user,
                message: message
            }
            await LogsModel.create(newLog)
        }
        catch (err) {
            console.log("Error en LogsDAO - addLog => ", err)
            return null
        }
    }

    async getAllLogs() {
        try {
            const allLogs = await LogsModel.find()
            const result = allLogs.map(log => log.toObject())
            return result
        }
        catch (err) {
            console.log("Error en LogsDAO - getAllLogs => ", err)
            return null
        }
    }
}

module.exports = { LogsDAO }
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
            console.log("Error en Logs DAO añadiendo un log", err)
            return null
        }
    }
}

module.exports = { LogsDAO }
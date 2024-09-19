class LogsDTO {

    constructor(log) {
        this.id = log._id.toString(),
            this.date = log.date,
            this.user = log.user,
            this.message = log.message
    }

    transform() {
        return {
            date: this.date,
            user: this.user,
            message: this.message
        }
    }
}

module.exports = { LogsDTO }
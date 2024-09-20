const { config } = require("dotenv")
config()

module.exports = {
    dbName: process.env.DB_NAME,
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI
}

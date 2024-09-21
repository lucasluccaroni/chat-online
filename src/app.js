// Imports
const express = require("express")
const handlebars = require("express-handlebars")
const mongoose = require("mongoose")
const { Server } = require("socket.io")
const { port, mongoUri, dbName } = require("./config")

// Instancia de class de la DB
const { LogsDAO } = require("./dao/logs.dao")
const logsDao = new LogsDAO()

// Instancia del DTO
const { LogsDTO } = require("./dto/logs.dto")

// App de express
const app = express()

// Permitir el envio de informacion mediante formularios y JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Configuracion de handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

// Configuracion de carpeta "public"
app.use(express.static(`${__dirname}/../public`))

// Rutas
const viewsRouter = require("./routes/views.router")
app.use("/", viewsRouter)


const main = async () => {

    // Conexion a la db
    await mongoose.connect(mongoUri, { dbName })

    // Listener del puerto
    const httpServer = app.listen(port, () => {
        console.log(`Servidor del chat prendido. puerto ${port}`)
    })

    const io = new Server(httpServer)

    io.on("connection", async (clientSocket) => {
        console.log(`Nuevo cliente conectado => ${clientSocket.id}`)


        // Le envia al nuevo cliente conectado todos los mensajes mandados hasta el momento MIN56 ver como mejorarlo.       
        const allLogs = await logsDao.getAllLogs()
        let messagesHistory = allLogs.map(log => {
            const logsDto = new LogsDTO(log)
            const transformation = logsDto.transform()
            return transformation
        })
        clientSocket.emit("init-messages", messagesHistory)

        clientSocket.on("new-user-connected", (username) => {
            // Notificar a los demas usuarios que uno nuevo se conecto
            clientSocket.broadcast.emit("user-joined-chat", username)
        })

        clientSocket.on("message", async (data) => {
            // Cada vez que se manda un mensaje se pushea la informacion al array
            try {
                const { username, text, date } = data
                await logsDao.addLog(date, username, text)
                io.emit("message", data)
            }
            catch (err) {
                console.log("Error al subir chats en DB => ", err)
            }
        })
    })
}
main()
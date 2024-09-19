//imports
const express = require("express")
const handlebars = require("express-handlebars")
const mongoose = require("mongoose")
const { Server } = require("socket.io")
const { port, mongoUri, dbName } = require("./config")

// instancia de class de la DB
const { LogsDAO } = require("./dao/logs.dao")
const logsDao = new LogsDAO()

// app de express
const app = express()

// permitir el envio de informacion mediante formularios y JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// configuracion de handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

// configuracion de carpeta "public"
app.use(express.static(`${__dirname}/../public`))

// rutas
const viewsRouter = require("./routes/views.router")
app.use("/", viewsRouter)


const main = async () => {

    // conexion a la db
    await mongoose.connect(mongoUri, { dbName })

    // listener del puerto
    const httpServer = app.listen(port, () => {
        console.log(`Servidor del chat prendido. puerto ${port}`)
    })

    const io = new Server(httpServer)

    // Esto guarda el historial de mensajes en memoria.
    const historialDeMensajes = []

    io.on("connection", (clientSocket) => {
        console.log(`Nuevo cliente conectado => ${clientSocket.id}`)

        //TODO:
        // Le envia al nuevo cliente conectado todos los mensajes mandados hasta el momento MIN56 ver como mejorarlo.
        for (const data of historialDeMensajes) {
            clientSocket.emit("message", data)
        }

        clientSocket.on("new-user-connected", (username) => {
            //notificar a los demas usuarios que uno nuevo se conecto
            clientSocket.broadcast.emit("user-joined-chat", username)
        })

        clientSocket.on("message", async (data) => {
            // Cada vez que se manda un mensaje se pushea la informacion al array
            try {
                const { username, text, fechaFormateada } = data
                await logsDao.addLog(fechaFormateada, username, text)
                io.emit("message", data)
            }
            catch (err) {
                console.log("Error al subir chats en DB => ", err)
            }
        })
    })
}
main()
const express = require("express")
const handlebars = require("express-handlebars")
const { Server } = require("socket.io")

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

// listener del puerto
const httpServer = app.listen(8080, () => {
    console.log(`Servidor del chat prendido. puerto 8080`)
})

const io = new Server(httpServer)

// Esto guarda el historial de mensajes en memoria. Habria que hacerlo en una DB
const historialDeMensajes = []

io.on("connection", (clientSocket) => {
    console.log(`Nuevo cliente conectado => ${clientSocket.id}`)

    // Le envia al nuevo cliente conectado todos los mensajes mandados hasta el momento MIN56 ver como mejorarlo.
    for(const data of historialDeMensajes) {
        clientSocket.emit("message", data)
    }

    clientSocket.on("new-user-connected", (username) => {
        //notificar a los demas usuarios que uno nuevo se conecto
        clientSocket.broadcast.emit("user-joined-chat", username)
    })


    clientSocket.on("message", (data) => {
        // Cada vez que se manda un mensaje se pushea la informacion al array
        historialDeMensajes.push(data)

        io.emit("message", data)
    })
})
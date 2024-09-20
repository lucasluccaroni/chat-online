// Javascript desde el browser
const socket = io()
let username

const messageLogs = document.getElementById("messageLogs")
let chatBox = document.getElementById("chatBox")
const sendButton = document.getElementById("sendButton")

let ahora = new Date()
const fechaFormateada = ahora.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
})

// Funcion para sanitizar el codigo
const escapeHtml = (text)=> {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, function(m) { return map[m] })
}

// bloquear pantalla del usuario y pedirle username
Swal.fire({
    title: "¡Bienvenido! Identificate.",
    text: "Ingresa tu usuario para identificarte en el chat.",
    input: "text",
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value) {
            return "¡Necesitas escribir un nombre de usuario para continuar!"
        }

        const regex = /^[a-zA-Z]{3,}[0-9]*$/
        if (!regex.test(value)) {
            return "El nombre de usuario debe contener al menos 3 letras."
        }

        return null
    }

}).then(result => {
    if (result.isConfirmed) {
        username = result.value
        console.log(`Usuario ingresado: ${username}`)

        // notificamos al servidor que se conectó
        socket.emit("new-user-connected", username)
    }
})


// escuchar el evento "Enter" y enviar el mensaje al chat
chatBox.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        let text = chatBox.value
        text = escapeHtml(text)

        if (text.trim().length > 0) {
            socket.emit("message", { username, text, fechaFormateada })
            chatBox.value = ""
        }
    }
})

// escuchar el boton "enviar" y enviar el mensaje al chat
sendButton.addEventListener("click", e => {
    e.preventDefault()
    let text = chatBox.value
    text = escapeHtml(text)

    if (text.trim().length > 0) {
        socket.emit("message", { username, text, fechaFormateada })
        chatBox.value = ""
    }
})


// escuchar los mensajes desde el servidor y mostrarlos
socket.on("message", (data) => {
    const { username, text, fechaFormateada } = data
    messageLogs.innerHTML += `${fechaFormateada} -- ${username} : ${text} </br>`
})

// escuchar el historial de mensajes e imprimirlo en pantalla
socket.on("init-messages", (messagesHistory) => {
    messagesHistory.forEach(log => {
        const { date, user, message } = log
        messageLogs.innerHTML += `${date} -- ${user} : ${message} </br>`
    });
})

// envia un toast a todos los demas usuarios avisando que uno nuevo se unio al chat
socket.on("user-joined-chat", username => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true
    })
    Toast.fire({
        icon: "success",
        title: `${username} se ha conectado al chat.`
    })
})

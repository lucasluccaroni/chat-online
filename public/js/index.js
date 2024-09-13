// Javascript desde el browser
const socket = io()
let username
const messageLogs = document.getElementById("messageLogs")

let chatBox = document.getElementById("chatBox")
const hiddenDiv = document.getElementById("hiddenDiv")


// expansion del chatBox a medida que escribo texto
chatBox.addEventListener("input", () => {
    hiddenDiv.style.display = 'block';
    hiddenDiv.style.width = chatBox.offsetWidth + 'px';
    hiddenDiv.textContent = chatBox.value + '\u200b'; // Añade un espacio en blanco para asegurar el ajuste de altura
    textarea.style.height = hiddenDiv.scrollHeight + 'px';
    hiddenDiv.style.display = 'none';
});
hiddenDiv.style.width = chatBox.offsetWidth + 'px';
hiddenDiv.textContent = chatBox.value + '\u200b';
textarea.style.height = hiddenDiv.scrollHeight + 'px';


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

        //! validacion de username para bd?
        //! guardar datos en localStorage para mantener la "sesion"?

        // notificamos al servidor que se conectó
        socket.emit("new-user-connected", username)
    }
})


// escuchar el evento "Enter" y enviar el mensaje al chat
chatBox.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        let text = chatBox.value

        if (text.trim().length > 0) {
            socket.emit("message", { username, text })
            chatBox.value = ""
        }
    }
})

// escuchar los mensajes desde el servidor y mostrarlos
socket.on("message", (data) => {
    const { username, text} = data
    messageLogs.innerHTML += `${username} dice: ${text} </br>`
})

// envia un toast a todos los demas usuarios avisando que uno nuevo se unio al chat
socket.on("user-joined-chat", username =>{
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
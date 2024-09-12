// Javascript desde el browser
const socket = io()
let user
let chatBox = document.getElementById("chatBox")

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
        // return !value && "¡Necesitas escribir un nombre de usuario para continuar!"
    }

}).then(result => {
    if(result.isConfirmed) {
        console.log(`Usuario ingresado: ${result.value}`)
        user = result.value
    }
})
const { secret } = require("../config")

module.exports = {
    secret: secret,
    resave: true,
    saveUninitialized: true
}
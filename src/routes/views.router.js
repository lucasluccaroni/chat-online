const { Router } = require("express")
const router = Router()

router.get("/", (_, res) => {
    res.render("index", {
        title: "Live-Chat",
        useWS: true,
        useSweetAlert: true,
        scripts: [
            "index.js"
        ]
    })
})

module.exports = router
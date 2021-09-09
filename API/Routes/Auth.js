const express = require("express")
const authRouter = express.Router()
const Auth = require("../Controllers/Auth/Index")

authRouter.post("/login", Auth.Login)
authRouter.post("/register", Auth.Register)
authRouter.post("/reset", Auth.Reset)
authRouter.get("/verify-account", Auth.VerifyEmail)

module.exports = { authRouter }
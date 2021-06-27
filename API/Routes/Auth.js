const express = require("express")
const authRouter = express.Router()
const Auth = require("../Controllers/Auth/Index")

authRouter.post("/login", Auth.Login)
authRouter.post("/register", Auth.Register)

module.exports = { authRouter }
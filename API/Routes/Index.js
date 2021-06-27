const express = require("express")
const Router = express.Router()
const { authRouter } = require("./Auth")
const { userRouter } = require("./User")
const { websiteRouter } = require("./Website")
const { User} = require("../Middleware/Permession")

Router.use("/auth", authRouter)
Router.use("/user", User, userRouter)
Router.use("/website", websiteRouter)

module.exports = Router
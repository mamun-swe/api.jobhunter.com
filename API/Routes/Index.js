const express = require("express")
const Router = express.Router()
const { authRouter } = require("./Auth")
const { seekerRouter } = require("./Seeker")
const { companyRouter } = require("./Company")
const { websiteRouter } = require("./Website")
const { Company, Seeker } = require("../Middleware/Permession")

Router.use("/auth", authRouter)
Router.use("/seeker", Seeker, seekerRouter)
Router.use("/company", Company, companyRouter)
Router.use("/website", websiteRouter)

module.exports = Router
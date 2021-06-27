const express = require("express")
const seekerRouter = express.Router()
const Profile = require("../Controllers/Seeker/ProfileController")

seekerRouter.get("/profile", Profile.Index)

module.exports = { seekerRouter }
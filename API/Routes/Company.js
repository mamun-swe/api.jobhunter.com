const express = require("express")
const companyRouter = express.Router()
const Profile = require("../Controllers/Company/ProfileController")
const Job = require("../Controllers/Company/JobController")

companyRouter.get("/profile", Profile.Index)
companyRouter.put("/profile", Profile.Update)
companyRouter.put("/password-update", Profile.UpdatePassword)

companyRouter.get("/job", Job.Index)
companyRouter.post("/job", Job.Create)

module.exports = { companyRouter }
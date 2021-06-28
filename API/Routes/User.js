const express = require("express")
const userRouter = express.Router()
const Profile = require("../Controllers/User/ProfileController")
const Job = require("../Controllers/User/JobController")

userRouter.get("/profile", Profile.Index)
userRouter.put("/profile", Profile.Update)
userRouter.put("/password-update", Profile.UpdatePassword)
userRouter.get("/my-applications", Profile.MyApplications)
userRouter.post("/upload-cv", Profile.UploadCv)

userRouter.get("/job", Job.Index)
userRouter.post("/job", Job.Create)
userRouter.get("/job/:id/applicants", Job.Applicants)

module.exports = { userRouter }
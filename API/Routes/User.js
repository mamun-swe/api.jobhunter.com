const express = require("express")
const userRouter = express.Router()
const Profile = require("../Controllers/User/ProfileController")
const Job = require("../Controllers/User/JobController")
const Chat = require("../Controllers/User/ChatController")
const Rating = require("../Controllers/User/RatingController")

userRouter.get("/profile", Profile.Index)
userRouter.put("/profile", Profile.Update)
userRouter.put("/password-update", Profile.UpdatePassword)
userRouter.get("/my-applications", Profile.MyApplications)
userRouter.post("/upload-cv", Profile.UploadCv)
userRouter.post("/upload-picture", Profile.UploadPicture)

userRouter.get("/job", Job.Index)
userRouter.post("/job", Job.Create)
userRouter.get("/job/:id/applicants", Job.Applicants)
userRouter.post("/job/change-status", Job.ChangeApplicationStatus)

userRouter.get("/messages/:author/:to", Chat.GetMessages)
userRouter.get("/messages/users", Chat.AllUsers)

userRouter.post("/rating", Rating.Store)

module.exports = { userRouter }
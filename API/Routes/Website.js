const express = require("express")
const websiteRouter = express.Router()
const Job = require("../Controllers/Website/JobController")

websiteRouter.get("/jobs", Job.Index)
websiteRouter.get("/jobs/:id", Job.Show)
websiteRouter.post("/apply", Job.Apply)
websiteRouter.get("/search", Job.Search)

module.exports = { websiteRouter }
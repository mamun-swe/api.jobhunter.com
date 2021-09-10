const jwt = require('jsonwebtoken')
const Job = require("../../../Models/Job")
const User = require("../../../Models/User")
const Comment = require("../../../Models/Comment")
const CheckId = require("../../Middleware/CheckId")
const Validator = require("../../Validator/Comment")
const { RatingCalculator } = require("../../Helpers/_helpers")

// List of latest jobs
const Index = async (req, res, next) => {
    try {
        let jobs = []
        let startDay = new Date()
        startDay.setUTCHours(0, 0, 0, 0)

        const results = await Job.find({
            "expiredAt": { "$gte": new Date(startDay) }
        })
            .populate("createdBy", "name")
            .populate("ratings", "rating")
            .populate({
                path: "comments",
                select: "comment user",
                populate: {
                    path: "user",
                    select: "name"
                }
            })
            .sort({ _id: -1 })
            .exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: "No jobs available"
            })
        }

        for (let i = 0; i < results.length; i++) {
            const element = results[i]
            const ratings = await RatingCalculator(element.ratings)

            jobs.push({
                _id: element._id,
                jobType: element.jobType,
                description: element.description,
                comments: element.comments,
                ratings: ratings,
                createdBy: element.createdBy,
                title: element.title,
                area: element.area,
                location: element.location,
                category: element.category,
                startSalary: element.startSalary,
                endSalary: element.endSalary,
                salaryType: element.salaryType,
                vacancy: element.vacancy,
                expiredAt: element.expiredAt,
                applicants: element.applicants,
                createdAt: element.createdAt,
                updatedAt: element.updatedAt
            })
        }

        res.status(200).json({
            status: true,
            jobs: jobs
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Show specific job
const Show = async (req, res, next) => {
    try {
        const { id } = req.params
        let startDay = new Date()
        startDay.setUTCHours(0, 0, 0, 0)

        const result = await Job.findOne(
            { $and: [{ _id: id }, { "expiredAt": { "$gte": new Date(startDay) } }] }
        )
            .populate("createdBy", "name email website description")
            .exec()

        if (!result) {
            return res.status(404).json({
                status: false,
                message: "Job not available"
            })
        }

        res.status(200).json({
            status: true,
            job: result
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Apply to job
const Apply = async (req, res, next) => {
    try {
        const { jobId } = req.body
        const token = await req.headers.authorization

        if (!jobId) return res.status(404).json({ message: 'Job ID required' })
        if (!token) return res.status(404).json({ message: 'Login required' })

        // decode token
        const splitToken = await req.headers.authorization.split(' ')[1]
        const decode = await jwt.verify(splitToken, process.env.JWT_SECRET)
        const applicantId = decode._id

        // Check job available/not
        const postedJob = await Job.findById({ _id: jobId }).exec()
        if (!postedJob) {
            return res.status(404).json({
                status: false,
                message: "Job not available."
            })
        }

        // Check is myjob/not
        const myJob = await Job.findOne({ $and: [{ _id: jobId }, { createdBy: applicantId }] }).exec()
        if (myJob) {
            return res.status(404).json({
                status: false,
                message: "This is your own posted job."
            })
        }

        // Check already applied / not
        const checkUser = await User.findById({ _id: applicantId }, { applications: 1 })
        if (checkUser.applications && checkUser.applications.length) {
            const exist = checkUser.applications.find(x => x == jobId)
            if (exist) {
                return res.status(404).json({
                    status: false,
                    message: "Already applied."
                })
            }
        }

        // Apply to job
        await Job.findOneAndUpdate(
            { _id: jobId },
            { $push: { applicants: { applicant: applicantId } } },
            { new: true }
        ).exec()

        // Save job to my account
        await User.findOneAndUpdate(
            { _id: applicantId },
            { $push: { applications: jobId } },
            { new: true }
        ).exec()

        res.status(201).json({
            status: true,
            message: "Successfully applied in this job."
        })

    } catch (error) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}

// Search job
const Search = async (req, res, next) => {
    try {
        let jobs = []
        let startDay = new Date()
        startDay.setUTCHours(0, 0, 0, 0)
        const { category, area } = req.query

        const results = await Job.find({
            $and: [
                { area: new RegExp(area, 'i') },
                { category: new RegExp(category, 'i') },
                { "expiredAt": { "$gte": new Date(startDay) } }
            ]
        })
            .populate("createdBy", "name")
            .populate("ratings", "rating")
            .populate({
                path: "comments",
                select: "comment user",
                populate: {
                    path: "user",
                    select: "name"
                }
            })
            .sort({ _id: -1 })
            .exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: "No jobs available"
            })
        }

        for (let i = 0; i < results.length; i++) {
            const element = results[i]
            const ratings = await RatingCalculator(element.ratings)

            jobs.push({
                _id: element._id,
                jobType: element.jobType,
                description: element.description,
                comments: element.comments,
                ratings: ratings,
                createdBy: element.createdBy,
                title: element.title,
                area: element.area,
                location: element.location,
                category: element.category,
                startSalary: element.startSalary,
                endSalary: element.endSalary,
                salaryType: element.salaryType,
                vacancy: element.vacancy,
                expiredAt: element.expiredAt,
                applicants: element.applicants,
                createdAt: element.createdAt,
                updatedAt: element.updatedAt
            })
        }

        res.status(200).json({
            status: true,
            jobs: jobs
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Comment in job post
const JobComment = async (req, res, next) => {
    try {
        const user = req.user._id
        const { jobId, comment } = req.body
        await CheckId(jobId)

        // validate check
        const validate = await Validator.Create(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        const newComment = new Comment({
            user,
            job: jobId,
            comment
        })

        await Job.findOneAndUpdate(
            { _id: jobId },
            { $push: { comments: newComment._id } },
            { new: true }
        ).exec()

        await newComment.save()

        res.status(201).json({
            status: true,
            message: "You are commented on this job post."
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Visit profile
const Profile = async (req, res, next) => {
    try {
        const { id } = req.params

        let result = await User.findOne({ _id: id }, { password: 0 }).exec()

        if (!result) {
            return res.status(404).json({
                status: false,
                message: "Account not found."
            })
        }

        res.status(200).json({
            status: true,
            user: result
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Show,
    Apply,
    Search,
    JobComment,
    Profile
}
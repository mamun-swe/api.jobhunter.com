const jwt = require('jsonwebtoken')
const Job = require("../../../Models/Job")

// List of latest jobs
const Index = async (req, res, next) => {
    try {
        let startDay = new Date()
        startDay.setUTCHours(0, 0, 0, 0)

        const results = await Job.find({ "expiredAt": { "$gte": new Date(startDay) } })
            .populate("company", "name")
            .sort({ _id: -1 })
            .exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: "No jobs available"
            })
        }

        res.status(200).json({
            status: true,
            jobs: results
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
            .populate("company", "name email website description")
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
        if (error) {
            console.log(error)
            next(error)
        }
    }
}

// Apply to job
const Apply = async (req, res, next) => {
    try {
        const { jobId } = req.body
        const token = await req.headers.authorization
        if (!token) return res.status(404).json({ message: 'Login required' })

        // decode token
        const splitToken = await req.headers.authorization.split(' ')[1]
        const decode = await jwt.verify(splitToken, process.env.JWT_SECRET)
        const role = decode.role
        const applicantId = decode._id

        const postedJob = await Job.findById({ _id: jobId }).exec()
        if (!postedJob) {
            return res.status(404).json({
                status: false,
                message: "Job not available."
            })
        }

        if (role === "company") {
            // Add to company applicatn
            await Job.findOneAndUpdate(
                { _id: jobId },
                { $push: { companyApplicants: applicantId } },
                { new: true }
            ).exec()
        } else {
            // Add to seeker applicatn
            await Job.findOneAndUpdate(
                { _id: jobId },
                { $push: { seekerApplicants: applicantId } },
                { new: true }
            ).exec()
        }

        res.status(201).json({
            status: true,
            message: "Successfully applied in this job."
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Search job
const Search = async (req, res, next) => {
    try {
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
            .populate("company", "name")
            .sort({ _id: -1 })
            .exec()

        if (!results.length) {
            return res.status(404).json({
                status: false,
                message: "No jobs available"
            })
        }

        res.status(200).json({
            status: true,
            jobs: results
        })


    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Show,
    Apply,
    Search
}
const Job = require("../../../Models/Job")
const Validator = require("../../Validator/Job")
const CheckId = require("../../Middleware/CheckId")

// List of jobs
const Index = async (req, res, next) => {
    try {
        const id = req.user._id

        let results = await Job.find({ createdBy: id })
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

// Create a job
const Create = async (req, res, next) => {
    try {
        const id = req.user._id
        const {
            title,
            area,
            location,
            category,
            startSalary,
            endSalary,
            salaryType,
            jobType,
            vacancy,
            expiredAt,
            description
        } = req.body

        // validate check
        const validate = await Validator.Create(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        const newJob = new Job({
            createdBy: id,
            title,
            area,
            location,
            category,
            startSalary,
            endSalary,
            salaryType,
            jobType,
            vacancy,
            expiredAt: new Date(expiredAt),
            description
        })

        await newJob.save()

        res.status(201).json({
            status: true,
            message: "Successfully new job created."
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Applicants of specific job
const Applicants = async (req, res, next) => {
    try {
        const { id } = req.params
        await CheckId(id)

        const result = await Job.findById({ _id: id }, { title: 1, applicants: 1 })
            .populate("applicants", "name email website description")
            .exec()

        if (!result) {
            res.status(404).json({
                status: false,
                message: "Job not found"
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

module.exports = {
    Index,
    Create,
    Applicants
}
const Job = require("../../../Models/Job")
const Rating = require("../../../Models/Rating")
const Validator = require("../../Validator/Rating")

// store item
const Store = async (req, res, next) => {
    try {
        const { _id } = req.user
        const { jobId, rating } = req.body

        // validate check
        const validate = await Validator.Store(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // chaeck available
        const isAvailable = await Rating.findOne({ $and: [{ user: _id }, { job: jobId }] }).exec()
        if (isAvailable) {
            return res.status(501).json({
                status: false,
                message: "Already submitted."
            })
        }

        const newRating = new Rating({
            user: _id,
            job: jobId,
            rating
        })

        await newRating.save()

        // update job
        const updateJob = await Job.findOneAndUpdate(
            { _id: jobId },
            { $push: { ratings: newRating._id } },
            { new: true }
        ).exec()

        if (!updateJob) {
            return res.status(501).json({
                status: false,
                message: "Failed to give rating."
            })
        }

        return res.status(201).json({
            status: true,
            message: "Successfully rating submitted."
        })
    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Store
}
const Job = require("../../../Models/Job")
const User = require("../../../Models/User")
const Validator = require("../../Validator/Auth")
const { UploadFile, DeleteFile, Host } = require("../../Helpers/_helpers")
const bcrypt = require('bcryptjs')

// Profile Index of user
const Index = async (req, res, next) => {
    try {
        const id = req.user._id
        const openedJob = await Job.countDocuments({ createdBy: id }).exec()
        let result = await User.findById({ _id: id }, { password: 0 }).exec()

        result.cv = result.cv ? Host(req) + "uploads/" + result.cv : null
        result.image = result.image ? Host(req) + "uploads/users/" + result.image : null

        res.status(200).json({
            status: true,
            user: result,
            openedJob,
            applied: result.applications ? result.applications.length : 0
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Update Account
const Update = async (req, res, next) => {
    try {
        const id = req.user._id
        const { name, website, description } = req.body

        // validate check
        const validate = await Validator.Update(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        const updateAccount = await User.findByIdAndUpdate(
            { _id: id },
            { $set: { name, website, description } },
            { $multi: false }
        ).exec()

        if (!updateAccount) {
            return res.status(404).json({
                status: false,
                message: 'Failed to update account.'
            })
        }

        res.status(201).json({
            status: true,
            message: "Successfully account updated."
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Update password
const UpdatePassword = async (req, res, next) => {
    try {
        const id = req.user._id
        const { newPassword } = req.body

        if (!newPassword) {
            return res.status(422).json({
                status: false,
                messgae: 'New password is required.'
            })
        }

        // Account find using id
        const account = await User.findById({ _id: id }).exec()
        if (!account) {
            return res.status(404).json({
                status: false,
                message: 'Account not found.'
            })
        }

        // Password Hash
        const hashNewPassword = await bcrypt.hash(newPassword, 10)

        // Update account
        const updateAccount = await User.findOneAndUpdate(
            { _id: id },
            { $set: { password: hashNewPassword } },
            { $multi: false }
        ).exec()

        if (!updateAccount) {
            return res.status(404).json({
                status: false,
                message: 'Failed to update'
            })
        }

        res.status(201).json({
            status: true,
            message: "Successfully password updated."
        })
    } catch (error) {
        if (error) next(error)
    }
}

// My Applications
const MyApplications = async (req, res, next) => {
    try {
        const id = req.user._id

        const result = await User.findById({ _id: id }, { applications: 1 })
            .populate({
                path: "applications",
                select: "title area location category jobType createdBy",
                populate: {
                    path: "createdBy",
                    select: "name website"
                }
            })
            .exec()

        if (!result) {
            return res.status(404).json({
                status: false,
                message: "Login required."
            })
        }

        res.status(200).json({
            status: true,
            applications: result.applications
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Upload CV
const UploadCv = async (req, res, next) => {
    try {
        const id = req.user._id
        const file = req.files

        if (!file) {
            return res.status(422).json({
                cv: "CV is required."
            })
        }

        const uploadFile = await UploadFile(file.cv, './uploads/')
        if (!uploadFile) {
            return res.status(501).json({
                status: false,
                message: 'Failed to upload banner'
            })
        }

        const updateAccount = await User.findByIdAndUpdate(
            { _id: id },
            { $set: { cv: uploadFile } },
            { $multi: false }
        ).exec()

        if (!updateAccount) {
            return res.status(404).json({
                status: false,
                message: 'Failed to Upload.'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully CV uploaded'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Upload profile picture
const UploadPicture = async (req, res, next) => {
    try {
        const id = req.user._id
        const file = req.files

        if (!file) return res.status(422).json({ image: "Image is required." })

        const uploadFile = await UploadFile(file.image, './uploads/users/')
        if (!uploadFile) {
            return res.status(501).json({
                status: false,
                message: 'Failed to upload picture.'
            })
        }

        // check old file 
        const account = await User.findById({ _id: id }, { image: 1 }).exec()
        if (!account) {
            return res.status(404).json({
                status: false,
                message: 'Account not avaiable.'
            })
        }

        if (account.image) await DeleteFile('./uploads/users/', account.image)

        // update account with new file
        const updateAccount = await User.findByIdAndUpdate(
            { _id: id },
            { $set: { image: uploadFile } },
            { $multi: false }
        ).exec()

        if (!updateAccount) {
            return res.status(404).json({
                status: false,
                message: 'Failed to Upload.'
            })
        }

        res.status(201).json({
            status: true,
            message: 'Successfully picture added.'
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Update,
    UpdatePassword,
    MyApplications,
    UploadCv,
    UploadPicture
}
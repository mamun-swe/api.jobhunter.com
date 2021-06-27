const Company = require("../../../Models/Company")
const Validator = require("../../Validator/Auth")
const bcrypt = require('bcryptjs')

// Profile Index of company
const Index = async (req, res, next) => {
    try {
        const id = req.user._id
        const result = await Company.findById({ _id: id }, { password: 0 }).exec()

        if (!result) {
            return res.status(404).json({
                status: false,
                message: "Account not found."
            })
        }

        res.status(200).json({
            status: true,
            company: result
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
        const validate = await Validator.CompanyUpdate(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        const updateAccount = await Company.findByIdAndUpdate(
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
        const account = await Company.findById({ _id: id }).exec()
        if (!account) {
            return res.status(404).json({
                status: false,
                message: 'Account not found.'
            })
        }

        // Password Hash
        const hashNewPassword = await bcrypt.hash(newPassword, 10)

        // Update account
        const updateAccount = await Company.findOneAndUpdate(
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

module.exports = {
    Index,
    Update,
    UpdatePassword
}
const Seeker = require("../../../Models/Seeker")
const Company = require("../../../Models/Company")
const Validator = require("../../Validator/Auth")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Login to account
const Login = async (req, res, next) => {
    try {
        let account
        const { email, password } = req.body

        // validate check
        const validate = await Validator.Login(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // Account find using email
        account = await Seeker.findOne({ email: email }).exec()
        if (!account) {
            account = await Company.findOne({ email: email }).exec()
        }

        if (!account) {
            return res.status(404).json({
                status: false,
                message: 'Invalid e-mail or password'
            })
        }

        // Compare with password
        const result = await bcrypt.compare(password, account.password)
        if (!result) {
            return res.status(404).json({
                status: false,
                message: 'Invalid e-mail or password'
            })
        }

        // Generate JWT token
        const token = await jwt.sign(
            {
                _id: account._id,
                role: account.role,
            }, process.env.JWT_SECRET, { expiresIn: '1d' }
        )

        return res.status(200).json({
            status: true,
            token
        })

    } catch (error) {
        if (error) next(error)
    }
}

// Create an account
const Register = async (req, res, next) => {
    try {
        let newUser
        let existAccount
        const { name, email, role, password } = req.body

        // validate check
        const validate = await Validator.Create(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        if (role === "company") existAccount = await Company.findOne({ email: email })
        if (role === "seeker") existAccount = await Seeker.findOne({ email: email })
        if (existAccount) {
            return res.status(422).json({
                status: false,
                message: 'E-mail already used.'
            })
        }

        // Password Hash
        const hashPassword = await bcrypt.hash(password, 10)

        if (role === "company") {
            newUser = new Company({
                name,
                email,
                role,
                password: hashPassword
            })
        }

        if (role === "seeker") {
            newUser = new Seeker({
                name,
                email,
                role,
                password: hashPassword
            })
        }

        const saveUser = await newUser.save()
        if (!saveUser)
            return res.status(501).json({
                status: false,
                message: 'Failed to create account.'
            })

        res.status(201).json({
            status: true,
            message: 'Successfully account created.'
        })

    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Login,
    Register
}
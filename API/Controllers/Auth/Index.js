const User = require("../../../Models/User")
const Validator = require("../../Validator/Auth")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Login to account
const Login = async (req, res, next) => {
    try {
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
        const account = await User.findOne({ email: email }).exec()
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
        const { name, email, password } = req.body

        // validate check
        const validate = await Validator.Create(req.body)
        if (validate.isValid === false) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        const existAccount = await User.findOne({ email: email })
        if (existAccount) {
            return res.status(422).json({
                status: false,
                message: 'E-mail already used.'
            })
        }

        // Password Hash
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name,
            email,
            password: hashPassword
        })

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
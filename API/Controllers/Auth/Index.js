
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require("../../../Models/User")
const Validator = require("../../Validator/Auth")
const { UniqueCode, SendEmail } = require("../../Helpers/_helpers")

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

        // if (!account.isEmailVerified) {
        //     return res.status(404).json({
        //         status: false,
        //         message: 'E-mail verification need.'
        //     })
        // }

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
        const randomCode = await UniqueCode()
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            emailVerificationCode: randomCode
        })

        // Mail data
        // const mailData = {
        //     from: '"Instant Job" <no-reply@instantjob.com>',
        //     to: email,
        //     subject: "Verification code",
        //     body: `<p>Verify your account <b><a href="${process.env.APP_URL}/api/v1/auth/verify-account?email=${email}&code=${randomCode}">Click me to Verify</a></b></p>`,
        // }

        // // Sent verification code to e-mail
        // const isMailSent = await SendEmail(mailData)
        // if (!isMailSent) {
        //     return res.status(501).json({
        //         status: false,
        //         message: 'Failed to create account.'
        //     })
        // }

        // Create user account
        await newUser.save()

        res.status(201).json({
            status: true,
            message: 'Successfully account created. verify you e-mail address.'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Reset Password
const Reset = async (req, res, next) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(422).json({
                status: false,
                email: "email address required."
            })
        }

        // Find account
        const account = await User.findOne({ email }, { password: 0 }).exec()
        if (!account) {
            return res.status(404).json({
                status: false,
                message: "Account not found."
            })
        }

        // Generate unique password
        const uniquePassword = await UniqueCode()

        // Password Hash
        const hashPassword = await bcrypt.hash(uniquePassword, 10)

        // Update account
        const updateAccount = await User.findOneAndUpdate(
            { email: email },
            { $set: { password: hashPassword } },
            { $multi: false }
        ).exec()

        if (!updateAccount) {
            return res.status(404).json({
                status: false,
                message: 'Failed to update'
            })
        }

        // Mail data
        const mailData = {
            from: '"Instant Job" <no-reply@instantjob.com>',
            to: email,
            subject: "Password Reset",
            body: `<p>Your new password <b>${uniquePassword}, don't share with anyone.</b></p>`,
        }

        // Sent verification code to e-mail
        const isMailSent = await SendEmail(mailData)
        if (!isMailSent) {
            return res.status(404).json({
                status: false,
                message: 'Failed to sent password to e-mail.'
            })
        }

        res.status(201).json({
            status: true,
            message: "Check your email, new password has been sent."
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Verify e-mail
const VerifyEmail = async (req, res, next) => {
    try {
        const { email, code } = req.query
        if (!email && !code) {
            return res.status(422).json({
                email: "E-mail is required.",
                code: "Verification code is required."
            })
        }

        // check account
        const account = await User.findOne({ $and: [{ email: email }, { emailVerificationCode: code }] })
        if (!account) {
            return res.status(404).json({
                message: "Invalid e-mail or verification code."
            })
        }

        // update account verification
        const updateAccount = await User.findOneAndUpdate(
            { $and: [{ email: email }, { emailVerificationCode: code }] },
            { $set: { isEmailVerified: true } },
            { $multi: false }
        ).exec()

        if (!updateAccount) {
            return res.status(404).json({
                message: "Verification failed."
            })
        }

        res.redirect(process.env.CLIENT_APP_URL)
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Login,
    Register,
    Reset,
    VerifyEmail
}
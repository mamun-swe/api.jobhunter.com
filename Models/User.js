const { Schema, model } = require("mongoose")

const validateEmail = function (email) {
    if (email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
    }
    return true
}

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validateEmail, "Please provide a valid email address"],
        default: null
    },
    presentAddress: {
        type: String,
        trim: true,
        default: null
    },
    permanentAddress: {
        type: String,
        trim: true,
        default: null
    },
    role: {
        type: String,
        trim: true,
        default: "user"
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    website: {
        type: String,
        trim: true,
        default: null
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
    applications: [{
        type: Schema.Types.ObjectId,
        ref: 'Job',
        default: null
    }],
    cv: {
        type: String,
        trim: true,
        default: null
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    emailVerificationCode: {
        type: String,
        trim: true,
        default: null
    }
}, {
    timestamps: true
})


const User = model("User", userSchema)
module.exports = User

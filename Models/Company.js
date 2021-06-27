const { Schema, model } = require("mongoose")

const validateEmail = function (email) {
    if (email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
    }
    return true
}

const companySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validateEmail, "Please provide a valid email address"],
        default: null
    },
    role: {
        type: String,
        trim: true,
        default: "company"
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        default: null
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
    }
}, {
    timestamps: true
})


const Company = model("Company", companySchema)
module.exports = Company

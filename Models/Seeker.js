const { Schema, model } = require("mongoose")

const validateEmail = function (email) {
    if (email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
    }
    return true
}

const seekerSchema = new Schema({
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
        default: "seeker"
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    education: {
        type: String,
        trim: true,
        default: null
    },
    category: {
        type: String,
        trim: true,
        default: null
    },
    area: {
        type: String,
        trim: true,
        default: null
    },
    applicatons: [{
        type: Schema.Types.ObjectId,
        ref: 'Job',
        default: null
    }]
}, {
    timestamps: true
})


const Seeker = model("Seeker", seekerSchema)
module.exports = Seeker

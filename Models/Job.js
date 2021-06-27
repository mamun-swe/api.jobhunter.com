const { Schema, model } = require("mongoose")

const jobSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    area: {
        type: String,
        trim: true,
        required: true
    },
    location: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    startSalary: {
        type: Number,
        trim: true,
        required: true
    },
    endSalary: {
        type: Number,
        trim: true,
        required: true
    },
    salaryType: {
        type: String,
        trim: true,
        required: true,
        enum: ["yearly", "monthly"]
    },
    jobType: {
        type: String,
        trim: true,
        default: "Full time",
        enum: ["Full time", "Part-time"]
    },
    vacancy: {
        type: Number,
        trim: true,
        required: true
    },
    expiredAt: {
        type: Date,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments',
        default: null
    }]
}, {
    timestamps: true
})


const Job = model("Job", jobSchema)
module.exports = Job

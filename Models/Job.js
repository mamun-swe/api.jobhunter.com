const { Schema, model } = require("mongoose")

const jobSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
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
        default: "full time",
        enum: ["full time", "part-time"]
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
    companyApplicants: [{
        type: Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    }],
    seekerApplicants: [{
        type: Schema.Types.ObjectId,
        ref: 'Seeker',
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

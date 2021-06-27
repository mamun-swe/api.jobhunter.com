
const Create = data => {
    let error = {}

    if (!data.jobId) error.jobId = "Job ID is required"
    if (!data.comment) error.comment = "Comment is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    Create
}
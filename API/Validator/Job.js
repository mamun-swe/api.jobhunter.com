
const Create = data => {
    let error = {}
    
    if (!data.title) error.title = "Title is required"
    if (!data.area) error.area = "Area is required"
    if (!data.location) error.location = "Location is required"
    if (!data.category) error.category = "Category is required"
    if (!data.startSalary) error.startSalary = "Start salary is required"
    if (!data.endSalary) error.endSalary = "End salary is required"
    if (!data.salaryType) error.salaryType = "Salary type is required"
    if (!data.jobType) error.jobType = "Job type is required"
    if (!data.vacancy) error.vacancy = "Vacancy is required"
    if (!data.expiredAt) error.expiredAt = "Expired at is required"
    if (!data.description) error.description = "Description is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}


module.exports = {
    Create
}

const Login = user => {
    let error = {}

    if (!user.email) error.email = "Email is required"
    if (!user.password) error.password = "Password is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

const Create = user => {
    let error = {}

    if (!user.name) error.name = "Name is required"
    if (!user.email) error.email = "Email is required"
    if (!user.password) error.password = "Password is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

const Update = user => {
    let error = {}

    if (!user.name) error.name = "Name is required"
    if (!user.website) error.website = "Website address is required"
    if (!user.description) error.description = "Description is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    Login,
    Create,
    Update
}
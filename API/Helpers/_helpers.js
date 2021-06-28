// Single file upload
const UploadFile = async (data, path) => {
    try {
        const image = data
        const extension = image.name.split('.')[1]

        const newName = Date.now() + '.' + extension
        uploadPath = path + newName
        const moveFile = image.mv(uploadPath)

        if (moveFile) return newName
    } catch (error) {
        if (error) return error
    }
}

// Get Host URL
const Host = (req) => {
    // return req.protocol + '://' + req.get('host') + '/'
    return 'http://' + req.get('host') + '/'
}


module.exports = { UploadFile, Host }
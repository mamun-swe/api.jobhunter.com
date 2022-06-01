const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const nocache = require('nocache')
const compression = require('compression')
const helmet = require('helmet')
require('dotenv').config()
const http = require("http")
const socketio = require("socket.io")
const fileUpload = require('express-fileupload')
const Route = require('./API/Routes/Index')
const { GetMessages, Store } = require("./API/Controllers/User/ChatController")

const app = express()
app.use(compression())
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(nocache())

// app.use(express.static("uploads"))
app.use('/uploads', express.static('uploads/'))
app.use('/uploads/users', express.static('uploads/users/'))

// API URL's
app.use("/api/v1", Route)

app.get('/', (req, res) => {
    res.send("Hello I am node.js application")
})

app.use((req, res, next) => {
    let error = new Error('404 page Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status == 404) {
        return res.status(404).json({
            message: error.message
        })
    }
    if (error.status == 400) {
        return res.status(400).json({
            message: "Bad request"
        })
    }
    if (error.status == 401) {
        return res.status(401).json({
            message: "You have no permission"
        })
    }
    return res.status(500).json({
        message: "Internal Server Error"
    })
})


//  ---------- Socket IO -------------
const server = http.createServer(app)
const io = socketio(server)

let rooms = []

io.on('connection', (socket) => {
    console.log('User connected')

    // Join to room
    socket.on('join', async ({ room }) => {
        try {
            let existRoom

            let updatedRoomName1 = `${room.author}--with--${room.reciver._id}`
            let updatedRoomName2 = `${room.reciver._id}--with--${room.author}`

            existRoom = rooms.find(x => x === updatedRoomName1)
            if (!existRoom) existRoom = rooms.find(x => x === updatedRoomName2)

            if (!existRoom) {
                rooms.push(updatedRoomName1)
                socket.join(updatedRoomName1)
            } else {
                socket.join(existRoom)
            }

            socket.emit('message', {
                author: "System",
                type: "text",
                data: {
                    text: `Welcome to chat system. Let's start your conversation with ${room.reciver.name}`
                }
            })

        } catch (error) {
            if (error) next(error)
        }
    })

    // Transfer Messages
    socket.on('message', async (data) => {
        try {
            let room

            let updatedRoomName1 = `${data.author}--with--${data.to}`
            let updatedRoomName2 = `${data.to}--with--${data.author}`

            room = rooms.find(x => x === updatedRoomName1)
            if (!room) room = rooms.find(x => x === updatedRoomName2)

            const storeMessage = await Store(data, room)

            if (storeMessage) {
                socket.broadcast.to(room).emit('message', {
                    author: data.sender,
                    type: "text",
                    data: {
                        text: data.message
                    }
                })
            }
        } catch (error) {
            if (error) next(error)
        }
    })

    // Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

// DB Connection here
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: false,
    useFindAndModify: false
})
    .then(() => console.log("Database connected"))
    .catch(error => {
        if (error) console.log('Failed to connect DB')
    })

// App Port
const port = process.env.PORT || 5000
server.listen(port, () => {
    console.log(`App running on ${port} port`)
})


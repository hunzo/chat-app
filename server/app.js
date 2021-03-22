const express = require('express')
const socketio = require('socket.io')

const app = express()
const router = require('./router')

const http = require('http')
const PORT = process.env.PORT || 5000
const server = http.createServer(app)

const { addUser, removeUser, getUser, getUserInRoom } = require('./users')

const io = socketio(server, {
    cors: {
        origin: '*',
    },
})

io.on('connection', (socket) => {
    console.log('user have as new connection!!!')
    console.log(socket.id)

    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room })

        if (error) return callback(error)

        // console.log(user)

        socket.emit('message', {
            user: 'admin',
            text: `${user.name} welcome to the room ${user.room}`,
        })
        socket.broadcast.to(user.room).emit('message', {
            user: 'admin',
            text: `${user.name} has joined!!!`,
        })

        socket.join(user.room)

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('message', { user: users.name, text: message })

        callback()
    })

    socket.on('disconnect', () => {
        console.log('user has left!!!')
    })
})

app.use(router)

server.listen(PORT, () => console.log(`server start on Port: ${PORT}`))

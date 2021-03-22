const express = require('express')
const socketio = require('socket.io')

const app = express()
const router = require('./router')

const http = require('http')
const PORT = process.env.PORT || 5000
const server = http.createServer(app)

const io = socketio(server, {
    cors: {
        origin: '*',
    },
})

io.on('connection', (socket) => {
    console.log('user have as new connection!!!')
    console.log(socket.id)

    socket.on('join', ({name, room}, callback) => {
        if (error) return callback(error)
        socket.emit('message', { user: 'admin', text: `${name}, welcome to room ${room}`})
        socket.broadcast.emit('message', {user: 'admin', text: `${name} has joind !!!`})
    })

    socket.on('disconect', () => {
        console.log('user has left!!!')
    })
})

app.use(router)

server.listen(PORT, () => console.log(`server start on Port: ${PORT}`))

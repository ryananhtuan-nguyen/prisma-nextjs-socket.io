const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
import { Server } from 'socket.io'
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
import prisma from './db'

io.on('connection', (socket) => {
  socket.on('loading-things', async () => {
    console.log('loading request received')
    const todos = await prisma.todo.findMany()
    socket.emit('here-you-go', todos)
  })

  socket.on('adding', async (data: string, cb: (e: Error | null) => void) => {
    await prisma.todo.create({
      data: {
        task: data,
        complete: false,
      },
    })

    socket.broadcast.emit('somebody-added')
    cb(null)
  })

  socket.on('clear', async (cb: (e: Error | null) => void) => {
    await prisma.todo.deleteMany()
    socket.broadcast.emit('clear')
    cb(null)
  })
})

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001')
})

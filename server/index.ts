import { Server } from 'socket.io'
import prisma from './db'
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  socket.on('get-data', async () => {
    const todos = await prisma.todo.findMany()
    io.emit('here-you-go', todos)
  })

  socket.on('add-this', async (task: string) => {
    await prisma.todo.create({ data: { task, complete: false } })
    io.emit('someone-added')
  })
  socket.on('clear', async () => {
    await prisma.todo.deleteMany()
    io.emit('clear')
  })
})

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001')
})

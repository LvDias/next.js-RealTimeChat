import { Server } from 'Socket.IO'

export default function socket(req, res) {
  
  if (res.socket.server.io) {
    
    console.log('Socket is already running')

  } else {
    
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {

      socket.on('join-room', room => {

        socket.join(room)

      })

      socket.on('input-message', obj => {

        socket.broadcast.to(obj.room).emit('response-message', {
          nickname: obj.nickname,
          message: obj.message
        })

      })

    })

  }

  res.end()

}

module.exports = (io) => {
  io.on('connection', (socket) => {
    //hàm console.log giống như hàm Serial.println trên Arduino
    console.log('Connected') //In ra màn hình console là đã có một Socket Client kết nối thành công.
    socket.emit('welcome', {message: 'Connected !!!!'})
    socket.on('JSON', (message) => {
      console.log('message', message)
      socket.emit('chat message', message)
    })
    socket.on('atime', (message) => {
      console.log('message', message)
    })
    socket.on('disconnect', function () {
      console.log('disconnect') 	//in ra màn hình console cho vui
    })
  })
}
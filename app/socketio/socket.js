const weatherModels = require('../../models/weather')

module.exports = (io) => {
    io.on('connection', (socket) => {
        //hàm console.log giống như hàm Serial.println trên Arduino
        console.log('Connected') //In ra màn hình console là đã có một Socket Client kết nối thành công.
        socket.emit('welcome', {message: 'Connected !!!!'})
        socket.on('JSON', (message) => {
            console.log('message', message)
            const weather = weatherModels.getWeatherFromObject(message)
            socket.broadcast.emit('chat message', weather)
        })
        socket.on('atime', (message) => {
            console.log('message', message)
        })
        socket.on('disconnect', () => {
            console.log('disconnect') 	//in ra màn hình console cho vui
        })
        socket.on('chat message', (msg) => {
            io.emit('chat message', msg)
        })
    })
}
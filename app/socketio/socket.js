const weatherModels = require('../../models/weather')
const socketEvent = require('./socketEvent')

module.exports = (io) => {
  io.on('connection', (socket) => {

    let sent = false
    //hàm console.log giống như hàm Serial.println trên Arduino
    console.log(socket.id + ' Connected') //In ra màn hình console là đã có một Socket Client kết nối thành công.
    socket.emit('welcome',
      {title: 'Connected !!!!', message: 'hello ' + socket.id})
    socket.on('disconnect', () => {
      console.log(socket.id + ' Disconnected') 	//in ra màn hình console cho vui
    })
    socket.on(socketEvent.EVENT_WEATHER_SENSOR, (data) => {
      console.log('Socket weather', JSON.stringify(data))
      const weather = weatherModels.getWeatherFromObject(data)
      if (weather.rain === 1 && sent === false) {
        console.log('Socket rain')
        sent = true
        socket.broadcast.emit(socketEvent.EVENT_RAIN_SENSOR, 'raining')
      }
      if (weather.rain === 0 && sent === true) {
        sent = false
      }
      socket.broadcast.emit(socketEvent.EVENT_WEATHER_SENSOR, weather)
    })
    socket.on(socketEvent.EVENT_RAIN_SENSOR, (data) => {
      console.log('Socket rain', data)
      socket.broadcast.emit(socketEvent.EVENT_RAIN_SENSOR, data)
    })
  })
}
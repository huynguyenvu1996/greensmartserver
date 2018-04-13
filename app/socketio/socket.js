const weatherModels = require('../../models/weather')
const socketEvent = require('./socketEvent')
const notificationsModel = require('../../models/notificationsModel')
const agriculturalModel = require('../../models/agriculturalProductModel')
const notificationUltil = require('../../configs/notification')
const constant = require('../../configs/constant')

module.exports = (io) => {
  io.on('connection', (socket) => {

    let sent = false
    let delayTime = 0
    let wait = false
    console.log(socket.id + ' Connected')
    socket.emit('welcome',
      {title: 'Connected !!!!', message: 'hello ' + socket.id})
    socket.on('disconnect', () => {
      console.log(socket.id + ' Disconnected')
    })
    socket.on(socketEvent.EVENT_WEATHER_SENSOR, async (data) => {
      const weather = weatherModels.getWeatherFromObject(data)
      console.log('Socket weather', JSON.stringify(weather))
      socket.broadcast.emit(socketEvent.EVENT_WEATHER_SENSOR, weather)
      if (Date.now() - delayTime > constant.DELAY_NOTIFICATION && wait ===
        false) {
        wait = true
        if (weather.rain === 1 && sent === false) {
          console.log('Socket rain')
          sent = true
          socket.broadcast.emit(socketEvent.EVENT_PUSH_NOTIFICATION,
            notificationUltil.Model.RAIN);
          delayTime = Date.now()
        }
        if (weather.rain === 0) {
          if (sent) {
            sent = false
          } else {
            const listAPG = await agriculturalModel.listAGP()
            const agricultural = []
            let detail = ''
            listAPG.forEach((element) => {
              if (element.drying && element.notification) {
                if (element.temp_max < weather.temperature) {
                  agricultural.push(element.name)
                  detail += `\n+ ${element.name}: Nhiệt độ hiên tại ${weather.temperature} cao hơn mức cho phép là: ${element.temp_max}`
                } else if (element.temp_min > weather.temperature) {
                  agricultural.push(element.name)
                  detail += `\n+ ${element.name}: Nhiệt độ hiên tại ${weather.temperature} thấp hơn mức cho phép là: ${element.temp_min}`
                }
                if (element.humidity_max < weather.humidity) {
                  agricultural.push(element.name)
                  detail += `\n+ ${element.name}: Độ ẩm hiên tại ${weather.humidity} cao hơn mức cho phép là: ${element.humidity_max}`
                } else if (element.humidity_min > weather.humidity) {
                  agricultural.push(element.name)
                  detail += `\n+ ${element.name}: Độ ẩm hiên tại ${weather.humidity} thấp hơn mức cho phép là: ${element.humidity_min}`
                }

              }
            })
            if (agricultural.length > 0) {
              const notiContent = notificationUltil.Model.COMMON(agricultural)
              notiContent.content += detail
              try {
                const result = await notificationsModel.createNotification(
                  notiContent)
                console.log('log', notiContent)
                delete notiContent.content
                notiContent.id = result.data.id
                delayTime = Date.now()
                socket.broadcast.emit(socketEvent.EVENT_PUSH_NOTIFICATION,
                  notiContent)
                sent = true
                console.log('log ', 'pushed')
              } catch (e) {
              }
            }
          }
        }
        wait = false
      }
    })
    socket.on(socketEvent.EVENT_RAIN_SENSOR, (data) => {
      console.log('Socket rain', data)
      socket.broadcast.emit(socketEvent.EVENT_RAIN_SENSOR, data)
    })
  })
}
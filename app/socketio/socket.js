/**
 * @Project GreenSmart
 * @Copyright (c) 2018 by G0714CLC. All Rights Reserved.
 * @Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

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
};
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

const weatherModels = require('../../models/weather');

module.exports = (io) => {
    io.on('connection', (socket) => {
        //hàm console.log giống như hàm Serial.println trên Arduino
        console.log('Connected'); //In ra màn hình console là đã có một Socket Client kết nối thành công.
        socket.emit('welcome', {message: 'Connected !!!!'});
        socket.on('JSON', (message) => {
            console.log('message', message);
            const weather = weatherModels.getWeatherFromObject(message)
            socket.broadcast.emit('chat message', weather)
        });
        socket.on('atime', (message) => {
            console.log('message', message)
        });
        socket.on('disconnect', () => {
            console.log('disconnect') 	//in ra màn hình console cho vui
        });
        socket.on('chat message', (msg) => {
            io.emit('chat message', msg)
        })
    })
};
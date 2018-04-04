/**
 * @Project GreenSmart
 * @Copyright (c) 2018 by G0714CLC. All Rights Reserved.
 * @Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const ip = require('ip');
const server = http.createServer(app);
const socketio = require('socket.io');

//Include the routes file
const routes = require('./app/routers');
const publicRoutes = require('./public/clientRouter');
const appConfigs = require('./configs/application');

// Socket io
const io = socketio(server);
require('./app/socketio/socket')(io);

app.use(express.static(__dirname + '/public'));

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//Use the routers file
app.use(publicRoutes);
app.use('/api/', routes);
app.set('socketio', io);

//Starting server
server.listen(appConfigs.server.port);
console.log('Server chay tai dia chi: ' + ip.address() + ':' +
    appConfigs.server.port);


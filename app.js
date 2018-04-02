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

const appConfigs = require('./configs/application')
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
let app = express();
let router = express.Router();
app.use(express.static(__dirname + '/public'));

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms


//Include the routes file
let routes = require('./routers/router')();
let agriculturalProduct = require('./routers/agriculturalProduct')();
let notifications = require('./routers/notifications')();
let weather = require('./routers/weather')();
let openWeather = require('./routers/openWeather')();

//Use the routers file
app.use('/', routes);
app.use('/agricultural-product', agriculturalProduct);
app.use('/notifications', notifications);
app.use('/weather', weather);
app.use('/openweather',openWeather);


//Starting server
app.listen(appConfigs.server.port);


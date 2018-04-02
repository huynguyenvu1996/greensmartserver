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

const utils = require('../local_modules/green_smart');
const networkUtils = utils.networkUtils;
const owmConfigs = require('../configs/openweathermap_api');


class OpenWeather {
    constructor(
        _id,
        name,
        temperature,
        humidity,
        rain,
        description,
        icon,
        country,
        dt,
        _rev
    )

    parseWeather = (result) => {
        return new OpenWeather(
            utils.stringUtils.getUniqueId(),
            result.name,
            result.main.temp,
            result.main.humidity,
            result.rain,
            result.weather.description,
            result.weather.icon,
            result.sys.country,
            result.date
        )
    }

    parseListWeather = (result) => {
        try {
            let listWeather = JSON.parse(result);



        } catch (e) {

        }
    }
}

module.exports = {
    getCurrentWeatherFromInternet: (coordinate) => {
        let query = {
            lat: coordinate.lat,
            lon: coordinate.lng,
            appid: owmConfigs.app_id,
            lang: owmConfigs.language,
            units: owmConfigs.units
        }
        networkUtils.getWithQueryParams(
            owmConfigs.weather,
            query
        ).then((result) => {

        }).catch((error) => {

        })
    },
    getWeatherForecastFromInternet: (coordinate) => {
        let query = {
            lat: coordinate.lat,
            lon: coordinate.lng,
            appid: owmConfigs.app_id,
            lang: owmConfigs.language,
            units: owmConfigs.units
        }
        networkUtils.getWithQueryParams(
            owmConfigs.weather,
            query
        ).then((result) => {

        }).catch((error) => {

        })
    }
}
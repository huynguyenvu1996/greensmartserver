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

const utils = require('../local_modules/green_smart');
const networkUtils = utils.networkUtils;
const dataUtils = utils.dataUtils;
const databaseUtils = utils.databaseUtils;
const owmConfigs = require('../configs/openweathermap_api');
const querystring = require('querystring');
const moment = require('moment');
const _ = require('lodash');
const docType = 'wfc'
let db = databaseUtils.getConnect();


class OpenWeather {

    constructor(_id,
                city_id,
                city_name,
                temperature,
                humidity,
                rain,
                description,
                icon,
                country,
                dt,
                _rev) {
        this._id = _id;
        this.city_id = city_id;
        this.city_name = city_name;
        this.temperature = temperature;
        this.humidity = humidity;
        this.rain = rain;
        this.description = description;
        this.icon = icon;
        this.country = country;
        this.dt = dt;
        this._rev = _rev;
    }

    static get CODE_SUCCESS_NUMBER() {
        return 200;
    };

    static get CODE_SUCCESS_STRING() {
        return '200';
    };

    static get CODE_ERROR() {
        return 401;
    };

    static isDataSuccess(result) {
        return _.isEqual(result.cod, this.CODE_SUCCESS_NUMBER) || _.isEqual(result.cod, this.CODE_SUCCESS_STRING);
    }

    static parseWeatherFromInternet(result) {
        try {
            return dataUtils.createSuccessInstance(
                {
                    _id: utils.stringUtils.getUniqueId(),
                    city_id: result.id,
                    city_name: result.name,
                    temperature: result.main.temp,
                    humidity: result.main.humidity,
                  rain: !_.isEmpty(result.rain),
                    description: result.weather['0'].description.charAt(0).toUpperCase() + result.weather['0'].description.slice(1),
                    icon: result.weather.icon,
                    country: result.sys.country,
                    dt: (result.dt * 1000).toString()
                }, 1);
        } catch (e) {
            return dataUtils.createErrorInstance('ParseWeatherFromInternet: ' + e.message);
        }
    }

    static parseListWeatherFromInternet(result) {
        try {
            let listWeather = [];
            result.list.forEach((value) => {
                listWeather.push(
                    {
                        _id: utils.stringUtils.getUniqueId(),
                        city_id: result.city.id,
                        city_name: result.city.name,
                        temperature: value.main.temp,
                        humidity: value.main.humidity,
                        rain: !_.isEmpty(value.rain) ? true : false,
                        description: value.weather['0'].description.charAt(0).toUpperCase() + value.weather['0'].description.slice(1),
                        icon: value.weather['0'].icon,
                        country: result.city.country,
                        dt: (value.dt * 1000).toString()
                    }
                )
            });
            return dataUtils.createSuccessInstance(listWeather, listWeather.length);
        } catch (e) {
            return dataUtils.createErrorInstance('ParseListWeatherFromInternet: ' + e.message);
        }
    }

    static parseWeatherForecastFromDatabase(result) {
        try {
            return new OpenWeather(
                result._id,
                result.city_id,
                result.city_name,
                result.temperature,
                result.humidity,
                result.rain,
                result.description,
                result.icon,
                result.country,
                result.dt,
                result._rev
            )
        }
        catch (e) {
            return dataUtils.createErrorInstance('ParseWeatherForecastFromDatabase: ' + e.message);
        }
    }

    static parseListWeatherForecastFromDatabase(result) {
        try {
            let listWeather = [];
            result.docs.forEach((value) => {
                listWeather.push(OpenWeather.parseWeatherForecastFromDatabase(value));
            });
            return listWeather;
        } catch (e) {
            return dataUtils.createErrorInstance('ParseListWeatherForecastFromDatabase: ' + e.message);
        }
    }
}

module.exports = {

    getCurrentWeatherFromInternet: async (coordinate) => {
        let weather = null, e = null;
        let query = {
            lat: coordinate.lat,
            lon: coordinate.lng,
            appid: owmConfigs.app_id,
            lang: owmConfigs.language,
            units: owmConfigs.units
        }
        await networkUtils.get(
            owmConfigs.weather.url + '?' + querystring.stringify(query),
        ).then((result) => {
            if (OpenWeather.isDataSuccess(result)) {
                weather = OpenWeather.parseWeatherFromInternet(result);
            } else {
                weather = dataUtils.createErrorInstance(result.message);
            }
        }).catch((error) => {
            e = error;
        })
        return new Promise((resolve, reject) => {
            !_.isNull(weather) ? resolve(weather) : reject(e);
        })

    },
    getWeatherForecastFromInternet: async (coordinate) => {
        let listWeather = null, e = null;
        let query = {
            lat: coordinate.lat,
            lon: coordinate.lng,
            appid: owmConfigs.app_id,
            lang: owmConfigs.language,
            units: owmConfigs.units
        }
        await networkUtils.get(
            owmConfigs.forecast.url + '?' + querystring.stringify(query),
        ).then((result) => {
            if (OpenWeather.isDataSuccess(result)) {
                listWeather = OpenWeather.parseListWeatherFromInternet(result);
            } else {
                listWeather = dataUtils.createErrorInstance(result.message);
            }
        }).catch((error) => {
            e = error;
        });
        return new Promise((resolve, reject) => {
            !_.isNull(listWeather) ? resolve(listWeather) : reject(e);
        })
    },
    getWeatherForecastFromDatabase: async () => {
        let listWeather = null, e = null;

        await db.createIndex({
            index: {
                fields: ['dt', 'type']
            }
        }).then((result) => {
        }).catch((error) => {
            e = databaseUtils.parseError(error);
        });

        if (_.isNull(e)) {
            await db.find({
                selector: {
                    type: docType,
                    dt: {$gt: true}
                },
                sort: [{dt: 'asc'}]
            }, (error, result) => {
                if (error) {
                    e = databaseUtils.parseError(error);
                }
                else {
                    let data = OpenWeather.parseListWeatherForecastFromDatabase(result);
                    listWeather = dataUtils.createSuccessInstance(data, data.length)
                }
            })
        }

        return new Promise((resolve, reject) => {
            !_.isNull(listWeather) ? resolve(listWeather) : reject(error)
        })
    },
    createWeatherForecast: async (listWeather) => {
        let res = null, e = null;

        listWeather.forEach((value) => {
            value.type = docType;
        });

        await db.bulkDocs(listWeather)
            .then(function (response) {
                res = dataUtils.createBasicSuccessInstance()
            }).catch(function (error) {
                e = databaseUtils.parseError(error);
            });

        return new Promise((resolve, reject) => {
            !_.isNull(res) ? resolve(res) : reject(e)
        })
    },

    deleteWeatherForecastFromDatabase: async (listWeather) => {

        let res = null, e = null;

        listWeather.forEach((value) => {
            value._deleted = true;
        });

        await db.bulkDocs(listWeather)
            .then(function (response) {
                res = dataUtils.createBasicSuccessInstance()
            }).catch(function (error) {
                e = databaseUtils.parseError(error);
            });

        return new Promise((resolve, reject) => {
            !_.isNull(res) ? resolve(res) : reject(e)
        })
    }
}
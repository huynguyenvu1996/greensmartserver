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

const openWeatherModel = require('../../models/openWeatherModel')
const utils = require('../../local_modules/green_smart/index')
const dataUtils = utils.dataUtils;
const dateUtils = utils.dateUtils;
const _ = require('lodash');
// const databaseUtils = utils.databaseUtils;
const coord = {
    lat: 10.771135,
    lng: 106.6707976,
}

let localReloadWeatherForecastFromDatabase = async (req, res, next) => {
    console.log('huy2');
    let listWeather = null, resultListWeather = null, e = null;
    await openWeatherModel.getWeatherForecastFromInternet(coord)
        .then((rsl) => {
            resultListWeather = rsl;
        }).catch((error) => {
            e = error;
        });
    if (dataUtils.isSuccessData(resultListWeather)) {
        console.log('==> GetWeatherForecastFromInternet');
        /*Put all list weather forecast to database*/
        await openWeatherModel.createWeatherForecast(dataUtils.getData(resultListWeather))
            .then((rsc) => {
                console.log(rsc);
            })
            .catch((error) => {
                e = error;
                console.log(error);
            })
        /*Get all list weather forecast from database*/
        await openWeatherModel.getWeatherForecastFromDatabase()
            .then((rsg) => {
                listWeather = rsg;
            }).catch((error) => {
                e = error;
            })
    } else {
        e = dataUtils.createErrorInstance("GetWeatherForecastFromInternet: Get data forecast is not successful!");
    }

    return new Promise((resolve, reject) => {
        !_.isNull(e) ? reject(e) : resolve(listWeather);
    })
}

let reloadWeatherForecastFromDatabase = (req, res, next) => {
    openWeatherModel.getWeatherForecastFromInternet(coord)
        .then((listWeather) => {
            if (dataUtils.isSuccessData(listWeather)) {
                console.log('==> GetWeatherForecastFromInternet');
                openWeatherModel.createWeatherForecast(listWeather.data)
                    .then((rsc) => {
                        openWeatherModel.getWeatherForecastFromDatabase()
                            .then((rsg) => {
                                res.json(rsg);
                            }).catch((error) => {
                                res.json(error);
                            })
                    })
                    .catch((error) => {
                        res.json(error);
                    })
            } else {
                res.json(dataUtils.createErrorInstance("GetWeatherForecastFromInternet: Get data forecast is not successful!"));
            }
        }).catch((error) => {
            res.json(error);
        });
}

module.exports.Action = {

    getCurrentWeatherFromInternet: (req, res, next) => {
        openWeatherModel.getCurrentWeatherFromInternet(coord)
            .then((result) => {
                res.json(result);
            })
            .catch((error) => {
                res.json(error);
            })
    },

    getWeatherForecastFromInternet: (req, res, next) => {
        openWeatherModel.getWeatherForecastFromInternet(coord)
            .then((result) => {
                res.json(result);
            })
            .catch((error) => {
                res.json(error);
            })
    },
    getWeatherForecastFromDatabase: (req, res, next) => {
        openWeatherModel.getWeatherForecastFromDatabase()
            .then((result) => {
                if (_.isEqual(result.count, 0)) {
                    this.reloadWeatherForecastFromDatabase(req, res, next);
                } else {
                    if (dateUtils.isPassedNewHour(result.data['0'].dt)) {
                        console.log('==> IsPassedNewHour: true');
                        openWeatherModel.deleteWeatherForecastFromDatabase(result.data)
                            .then((result) => {
                                this.reloadWeatherForecastFromDatabase(req, res, next);
                            }).catch((error) => {
                                res.json(error);
                            });
                    }
                    else {
                        console.log('==> IsPassedNewHour: false');
                        res.json(result);
                    }
                }
            }).catch((error) => {
                res.json(error);
            })
    },
    localGetWeatherForecastFromDatabase: async (req, res, next) => {
        let listWeather = null, resultListWeather = null, e = null, reload = false;
        await openWeatherModel.getWeatherForecastFromDatabase()
            .then((result) => {
                if (_.isEmpty(result.data)) {
                    reload = true;
                }
                listWeather = result;
            }).catch((error) => {
                e = error;
            });

        if (!_.isEmpty(listWeather.data) && dateUtils.isPassedNewHour(listWeather.data['0'].dt)) {
            console.log('==> IsPassedNewHour: true');
            await openWeatherModel.deleteWeatherForecastFromDatabase(listWeather.data)
                .then((result) => {
                    reload = true;
                }).catch((error) => {
                    e = error;
                });
        }
        else {
            console.log('==> IsPassedNewHour: false');
        }

        if (reload) {
            await openWeatherModel.getWeatherForecastFromInternet(coord)
                .then((rsl) => {
                    resultListWeather = rsl;
                }).catch((error) => {
                    e = error;
                });
            if (dataUtils.isSuccessData(resultListWeather)) {
                console.log('==> GetWeatherForecastFromInternet');
                /*Put all list weather forecast to database*/
                await openWeatherModel.createWeatherForecast(dataUtils.getData(resultListWeather))
                    .then((rsc) => {
                        console.log(rsc);
                    })
                    .catch((error) => {
                        e = error;
                        console.log(error);
                    })
                /*Get all list weather forecast from database*/
                await openWeatherModel.getWeatherForecastFromDatabase()
                    .then((rsg) => {
                        listWeather = rsg;
                    }).catch((error) => {
                        e = error;
                    })
            } else {
                e = dataUtils.createErrorInstance("GetWeatherForecastFromInternet: Get data forecast is not successful!");
            }
        }
        
        return new Promise((resolve, reject) => {
            !_.isNull(e) ? reject(e) : resolve(listWeather);
        })

    },
}


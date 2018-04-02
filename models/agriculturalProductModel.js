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
const _ = require('lodash');
const networkUtils = utils.networkUtils;
const databaseUtils = utils.databaseUtils;
const stringUtils = utils.stringUtils;
const dataUtils = utils.dataUtils;
const dateUtils = utils.dateUtils;
const docType = 'agp';
let db = databaseUtils.getConnect();

class AgriculturalProduct {

    constructor(_id, name, image, temp_min, temp_max, humidity_min, humidity_max, detect_rain, drying, created_at, _rev) {
        this._id = _id,
            this.name = name,
            this.image = image,
            this.temp_min = temp_min,
            this.temp_max = temp_max,
            this.humidity_min = humidity_min,
            this.humidity_max = humidity_max,
            this.detect_rain = detect_rain,
            this.drying = drying,
            this.created_at = created_at,
            this._rev = _rev
    }

    static parseAGPFromDatabase(result) {
        try {
            return new AgriculturalProduct(
                result._id,
                result.name,
                result.image,
                parseInt(result.temp_min),
                parseInt(result.temp_max),
                parseInt(result.humidity_min),
                parseInt(result.humidity_max),
                result.detect_rain,
                result.drying,
                result.created_at,
                result._rev
            )
        }
        catch (e) {
            return dataUtils.createErrorInstance('ParseAGPFromDatabase: ' + e.message);
        }
    }

    static parseListAGPFromDatabase(result) {
        try {
            let listAGP = [];
            result.docs.forEach((value) => {
                listAGP.push(AgriculturalProduct.parseAGPFromDatabase(value));
            });
            return listAGP;
        } catch (e) {
            return dataUtils.createErrorInstance('ParseListAGPFromDatabase: ' + e.message);
        }
    }

    static parseAGPFromRequest(req) {
        try {
            return dataUtils.createSuccessInstance(
                new AgriculturalProduct(
                    req._id,
                    req.name,
                    req.image,
                    parseInt(req.temp_min),
                    parseInt(req.temp_max),
                    parseInt(req.humidity_min),
                    parseInt(req.humidity_max),
                    req.detect_rain,
                    req.drying,
                    req.created_at,
                    req._rev
                ), 1);
        }
        catch (e) {
            return dataUtils.createErrorInstance('ParseAGPFromDatabase: ' + e.message);
        }
    }

}

let isWeatherCompatible = (agp, weather) => {
    // console.log('---------------------------------');
    // console.log(agp);
    // console.log(weather);
    if ((weather.temperature >= agp.temp_min && weather.temperature <= agp.temp_max) &&
        (weather.humidity >= agp.humidity_min && weather.humidity <= agp.humidity_max) &&
        (!(weather.rain ^ agp.detect_rain) &&
            (dateUtils.isHourInterval(weather.dt, 6, 16)))
    ) {
        return true;
    }
    return false;
}

module.exports = {
    /*https://github.com/pouchdb/pouchdb/issues/6399*/
    /*https://github.com/nolanlawson/pouchdb-find/issues/27*/
    getListAGP: async (params) => {
        let listAGP = null, e = null;

        await db.createIndex({
            index: {
                fields: ['created_at', 'type']
            }
        }).then((result) => {
        }).catch((error) => {
            e = databaseUtils.parseError(error);
        });

        if (_.isNull(e)) {
            await db.find({
                selector: {
                    type: docType,
                    created_at: { $gt: true }
                },
                sort: [{ created_at: 'desc' }]
            }, (error, result) => {
                if (error) {
                    e = databaseUtils.parseError(error);
                }
                else {
                    let data = AgriculturalProduct.parseListAGPFromDatabase(result);
                    listAGP = dataUtils.createSuccessInstance(data, data.length)
                }
            })
        }

        return new Promise((resolve, reject) => {
            !_.isNull(listAGP) ? resolve(listAGP) : reject(error)
        })

    },
    viewAGPInfo: async (_id) => {
        let agp = null, e = null;
        await db.get(_id).then((doc) => {
            let data = AgriculturalProduct.parseAGPFromDatabase(doc);
            agp = dataUtils.createSuccessInstance(data, 0)
        }).catch((error) => {
            e = databaseUtils.parseError(error);
        });
        return new Promise((resolve, reject) => {
            !_.isNull(agp) ? resolve(agp) : reject(error)
        })
    },
    createAGP: async (data) => {
        let res = null, error = null;
        let agp = null;
        try {
            agp = {
                _id: stringUtils.getUniqueId(),
                name: data.name,
                image: data.image,
                temp_min: parseInt(data.temp_min),
                temp_max: parseInt(data.temp_max),
                humidity_min: parseInt(data.humidity_min),
                humidity_max: parseInt(data.humidity_max),
                detect_rain: data.detect_rain,
                drying: data.drying,
                created_at: Date.now().toString(),
                type: docType
            }
        } catch (e) {
            dataUtils.createErrorInstance('CreateAGP: ' + e.message);
        }
        await db.put(agp)
            .then(function (response) {
                res = dataUtils.createBasicSuccessInstance()
            }).catch(function (err) {
                e = databaseUtils.parseError(error);
            });

        return new Promise((resolve, reject) => {
            !_.isNull(res) ? resolve(res) : reject(error)
        })
    },
    updateAGP: async (data) => {
        let res = null, error = null;
        let agp = {
            _id: data._id,
            name: data.name,
            image: data.image,
            temp_min: parseInt(data.temp_min),
            temp_max: parseInt(data.temp_max),
            humidity_min: parseInt(data.humidity_min),
            humidity_max: parseInt(data.humidity_max),
            detect_rain: data.detect_rain,
            drying: data.drying,
            created_at: data.create_at,
            type: docType,
            _rev: data._rev
        }

        await db.put(agp)
            .then(function (response) {
                res = dataUtils.createBasicSuccessInstance()
            }).catch(function (err) {
                e = databaseUtils.parseError(error);
            });

        return new Promise((resolve, reject) => {
            !_.isNull(res) ? resolve(res) : reject(error)
        })
    },

    deleteAGP: async (agp) => {
        let res = null, e = null;
        await db.remove(agp).then((response) => {
            res = dataUtils.createBasicSuccessInstance();
        }).catch((error) => {
            e = databaseUtils.parseError(error);
        });
        return new Promise((resolve, reject) => {
            !_.isNull(res) ? resolve(res) : reject(e);
        })
    },

    getCompatibleWeatherList: async (data, listWeather) => {
        let listCompatibleWeather = [], e = null;
        let agpData = AgriculturalProduct.parseAGPFromRequest(data);
        let agp = null;
        if (!dataUtils.isSuccessData(agpData)) {
            e = dataUtils.createErrorInstance("GetCompatibleWeatherList: Can't parse data of agp!");
        } else {
            agp = dataUtils.getData(agpData);
            listWeather.forEach((value) => {
                if (isWeatherCompatible(agp, value)) {
                    listCompatibleWeather.push(value);
                }
            });
        }
        return new Promise((resolve, reject) => {
            !_.isNull(e) ? reject(e) : resolve(listCompatibleWeather);
        });
    }


}

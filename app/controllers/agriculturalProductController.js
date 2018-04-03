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

const agriculturalProductModel = require(
  '../../models/agriculturalProductModel')
const openWeatherController = require('./openWeatherController')
const utils = require('../../local_modules/green_smart/index')
const dataUtils = utils.dataUtils;
const dateUtils = utils.dateUtils;
const _ = require('lodash');


module.exports.Action = {

    getListAGP: (req, res, next) => {
        agriculturalProductModel.getListAGP()
            .then((result) => {
                res.json(result);
            }).catch((error) => {
                res.json(error);
            })
    },

    getViewAGP: (req, res, next) => {
        let _id = req.params.id;
        agriculturalProductModel.viewAGPInfo(_id)
            .then((result) => {
                res.json(result);
            }).catch((error) => {
                res.json(error);
            })
    },

    postCreateAGP: (req, res, next) => {
        let agp = req.body;
        let imagePath = req.file.path;
        agp['image'] = imagePath.substr(imagePath.indexOf('/') + 1, imagePath.lenght);
        agriculturalProductModel.createAGP(agp)
            .then((result) => {
                res.json(result);
            }).catch((error) => {
                res.json(error);
            })
    },

    postUpdateAGP: (req, res, next) => {
        let agp = req.body;
        let imagePath = req.file.path;
        agp['image'] = imagePath.substr(imagePath.indexOf('/') + 1, imagePath.lenght);
        agriculturalProductModel.createAGP(agp)
            .then((result) => {
                res.json(result);
            }).catch((error) => {
                res.json(error);
            })
    },

    getDeleteAGP: (req, res, next) => {
        let agp = {
            _id: req.params.id,
            _rev: req.params.rev
        };
        agriculturalProductModel.deleteAGP(agp)
            .then((result) => {
                res.json(result);
            }).catch((error) => {
                res.json(error);
            })
    },

    postCompatibleWeatherList: (req, res, next) => {
        let listCompatibleWeather = [];
        let listWeather = null;
        let agp = req.body;

        openWeatherController.Action.localGetWeatherForecastFromDatabase(req, res, next)
            .then((result) => {
                listWeather = dataUtils.getData(result);
                agriculturalProductModel.getCompatibleWeatherList(agp, listWeather)
                    .then((rsc) => {
                        res.json(rsc);
                    }).catch((error) => {
                        res.json(error);
                    })
            }).catch((error) => {
                res.json(dataUtils.createErrorInstance(error.message));
            });
    }

}
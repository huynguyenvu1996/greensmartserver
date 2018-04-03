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

const router = require('express').Router();
const utils = require('../../local_modules/green_smart/index')
const agriculturalProductController = require('../controllers/agriculturalProductController');
const key = 'agp';
let upload = utils.uploadUtils.getInstance(key);

router.get('/list', agriculturalProductController.Action.getListAGP)

router.get('/view/:id', agriculturalProductController.Action.getViewAGP)

router.post('/create', upload.single('image_file'),
  agriculturalProductController.Action.postCreateAGP)

router.post('/update', upload.single('image_file'),
  agriculturalProductController.Action.postUpdateAGP)

router.get('/delete/:id/:rev',
  agriculturalProductController.Action.getDeleteAGP)

router.post('/get-compatible-weather-list',
  agriculturalProductController.Action.postCompatibleWeatherList)

module.exports = router
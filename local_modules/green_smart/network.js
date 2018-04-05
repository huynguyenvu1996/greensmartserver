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

const axios = require('axios');
const dataUtils = require('./data');
const _ = require('lodash');


let parseError = (error) => {
    if (error.response) {
        // return appError.create(error.response.status,
        //     error.response.status
        //     + error.response.statusText + "!");
        dataUtils.createErrorInstance(error.response.statusText);
    } else if (error.request) {
        // return appError.create(appError.AppErrorClass.DEFAULT_STATUS,
        //     "The request was made but no response was received!");
        dataUtils.createErrorInstance("The request was made but no response was received!");
    } else {
        // return appError.create(appError.AppErrorClass.DEFAULT_STATUS,
        //     "Something happened in setting up the request");
        dataUtils.createErrorInstance("Something happened in setting up the request");
    }
}

module.exports = {
    get: async (url) => {
        let responseData = null, e = null;
        await axios.get(url)
            .then((response) => {
                responseData = response.data;
            }).catch((error) => {
                e = parseError(error);
            });

        return new Promise((resolve, reject) => {
            if (!_.isNull(responseData)) {
                resolve(responseData);
            }
            else {
                reject(e);
            }
        });
    },
    getWithQueryParams: async (url, params) => {
        let responseData = null, e = null;
        console.log(url);
        await axios.get(url, params)
            .then((response) => {
                responseData = response;
                console.log(responseData);
            }).catch((error) => {
                console.log(error);
                e = parseError(error);
            });

        return new Promise((resolve, reject) => {
            if (!_.isNull(responseData)) {
                resolve(responseData);
            }
            else {
                reject(e);
            }
        });
    },
    getWithPathParams: async (url, params) => {
        let responseData = null, e = null;
        await axios.get(url + params)
            .then((response) => {
                responseData = response;
            }).catch((error) => {
                e = parseError(error);
            });

        return new Promise((resolve, reject) => {
            if (!_.isNull(responseData)) {
                resolve(responseData);
            }
            else {
                reject(e);
            }
        });
    },
    post: async (url, data) => {
        let responseData = null, e = null;
        await axios.post(url, data)
            .then((response) => {
                responseData = response;
            }).catch(function (error) {
                e = parseError(error);
            });
        return new Promise((resolve, reject) => {
            if (!_.isNull(responseData)) {
                resolve(responseData);
            }
            else {
                reject(e);
            }
        });
    }
};



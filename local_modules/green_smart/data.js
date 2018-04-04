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

const _ = require('lodash');

class Data {

    constructor(code, message, data, count, error) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.count = count;
        this.error = error;
    }

    static get NO_COUNT() {
        return -1;
    };

    static get NO_MESSAGE() {
        return "";
    };

    static get NO_DATA() {
        return null;
    };

    static get CODE_SUCCESS() {
        return 200;
    };

    static get CODE_ERROR() {
        return 400;
    }

}

module.exports = {

    isInstance: (data) => {
        return data instanceof Data;
    },
    isSuccessData: (data) => {
        return _.isEqual(data.code, Data.CODE_SUCCESS);
    },
    getData: (result) => {
        return result.data;
    },
    createInstance: (code, message, data, count, error) => {
        return new Data(
            code, message, data, count, error
        )
    },
    createSuccessInstance: (data, count) => {
        return new Data(
            Data.CODE_SUCCESS,
            "Success!",
            data,
            count,
            false
        )
    },
    createBasicSuccessInstance: () => {
        return new Data(
            Data.CODE_SUCCESS,
            "Success!",
            Data.NO_DATA,
            Data.NO_COUNT,
            false
        )
    },
    createErrorInstance: (message) => {
        return new Data(
            Data.CODE_ERROR,
            message,
            Data.NO_DATA,
            Data.NO_COUNT,
            true
        )
    }

}

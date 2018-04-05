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

const moment = require('moment-timezone');
const timeZone = 'Asia/Ho_Chi_Minh';

module.exports = {

    getCurrentDate: () => {
        return Data.now();
    },
    isPassedNewHour: (dt) => {
        let date = moment(parseInt(dt)).tz(timeZone);
        let now = moment(Date.now()).tz(timeZone);
        // let now = moment(1523070000000).tz(timeZone);
        if ((now.hour() > date.hour() && now.day() == date.day() && now.month() == date.month() && now.year() == date.year()) ||
            (now.day() > date.day() && now.month() == date.month() && now.year() == date.year()) ||
            (now.month() > date.month() && now.year() == date.year()) ||
            (now.year() > date.year())) {
            return true;
        }
        return false;
    },
    isHourInterval: (dt, from, to) => {
        let date = moment(parseInt(dt)).tz(timeZone);
        if (date.hour() >= from && date.hour() <= to) {
            return true;
        }
        return false;
    }
}
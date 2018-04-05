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


/*https://github.com/expressjs/multer/issues/170*/
const config = require('./config');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime');

module.exports = {
    getInstance: (key) => {
        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                const location = config.getUploadLocation(key);
                if (!fs.existsSync(location)) {
                    fs.mkdirSync(location, 0o777)
                }
                cb(null, config.getUploadLocation(key))
            },
            filename: function (req, file, cb) {
                cb(null, config.getUploadPrefixName(key) + '_' + Date.now() + '.' + mime.getExtension(file.mimetype));
            }
        });
        return multer({storage: storage});
    }
};
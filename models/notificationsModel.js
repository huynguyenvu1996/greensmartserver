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
const docType = 'notify'

class Notification {
  constructor (_id, title, subject, content, read, created_at, _rev) {
    this._id = _id
    this.title = title
    this.subject = subject
    this.content = content
    this.read = read
    this.created_at = created_at
    this._rev = _rev
  };

  static parseNotifyFromDatabase (result) {
    try {
      return new Notification(
        result._id,
        result.title,
        result.subject,
        result.content,
        result.read,
        result.created_at,
        result._rev,
      )
    }
    catch (e) {
      return dataUtils.createErrorInstance('ParseNotifyFromDatabase: ' +
        e.message)
    }
  }

  static parseListNotiFromDatabase (result) {
    try {
      let listNotify = []
      result.docs.forEach((value) => {
        listNotify.push(Notification.parseNotifyFromDatabase(value))
      })
      return listNotify
    } catch (e) {
      return dataUtils.createErrorInstance('ParseListNotifyFromDatabase: ' +
        e.message)
    }
  }

}

async function listNotifications (params) {
  let listNotify = null, e = null

  await db.createIndex({
    index: {
      fields: ['created_at', 'type'],
    },
  }).then((result) => {
  }).catch((error) => {
    e = databaseUtils.parseError(error)
  })

  if (_.isNull(e)) {
    await db.find({
      selector: {
        type: docType,
        created_at: {$gt: true},
      },
      sort: [{created_at: 'desc'}],
    }, (error, result) => {
      if (error) {
        e = databaseUtils.parseError(error)
      }
      else {
        let data = Notification.parseListNotiFromDatabase(result)
        listNotify = dataUtils.createSuccessInstance(data, data.length)
      }
    })
  }

  return new Promise((resolve, reject) => {
    !_.isNull(listNotify) ? resolve(listNotify) : reject(error)
  })

}

async function getNotification (_id) {
  let notify = null, e = null
  await db.get(_id).then((doc) => {
    let data = Notification.parseNotifyFromDatabase(doc)
    notify = dataUtils.createSuccessInstance(data, 0)
  }).catch((error) => {
    e = databaseUtils.parseError(error)
  })
  return new Promise((resolve, reject) => {
    !_.isNull(notify) ? resolve(notify) : reject(e)
  })
}

async function createNotification (data) {
  let res = null, e = null
  let notify = null
  try {
    notify = {
      _id: stringUtils.getUniqueId(),
      title: data.title,
      subject: data.subject,
      content: data.content,
      read: false,
      created_at: Date.now().toString(),
      type: docType,
    }
  } catch (error) {
    dataUtils.createErrorInstance('CreateNotify: ' + error.message)
  }
  await db.put(notify).then(function (response) {
    res = dataUtils.createBasicSuccessInstance()
  }).catch(function (error) {
    e = databaseUtils.parseError(error)
  })

  return new Promise((resolve, reject) => {
    !_.isNull(res) ? resolve(res) : reject(e)
  })
}

module.exports = {
  listNotifications,
  getNotification,
  createNotification,
}
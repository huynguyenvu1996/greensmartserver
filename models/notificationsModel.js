const utils = require('../local_modules/green_smart')
const dataUtils = utils.dataUtils
const databaseUtils = utils.databaseUtils
const stringUtils = utils.stringUtils
const _ = require('lodash')
const docType = 'notify'
let db = databaseUtils.getConnect()

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

async function listNotifications (condition) {
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
      sort: [{created_at: condition.sort}],
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
      title: data.TITLE,
      subject: data.SUBJECT,
      content: data.CONTENT,
      read: false,
      created_at: Date.now().toString(),
      type: docType,
    }
  } catch (error) {
    dataUtils.createErrorInstance('CreateNotify: ' + error.message)
  }
  await db.put(notify).then((response) => {
    res = dataUtils.createSuccessInstance(response, 1)
  }).catch((error) => {
    e = databaseUtils.parseError(error)
  })

  return new Promise((resolve, reject) => {
    !_.isNull(res) ? resolve(res) : reject(e)
  })
}

async function deleteNotification (data) {
  let res = null, e = null
  await db.remove(data).then((response) => {
    res = dataUtils.createBasicSuccessInstance()
  }).catch((error) => {
    e = databaseUtils.parseError(error)
  })
  return new Promise((resolve, reject) => {
    !_.isNull(e) ? reject(e) : resolve(res)
  })
}

async function readNotification (data) {
  let res = null, e = null
  let notification = {
    _id: data._id,
    read: true,
    type: docType,
  }

  await db.put(notification).then(function (response) {
    res = dataUtils.createBasicSuccessInstance()
  }).catch(function (error) {
    e = databaseUtils.parseError(error)
  })

  return new Promise((resolve, reject) => {
    !_.isNull(e) ? reject(e) : resolve(res)
  })
}

module.exports = {
  listNotifications,
  getNotification,
  createNotification,
  deleteNotification,
  readNotification,
}
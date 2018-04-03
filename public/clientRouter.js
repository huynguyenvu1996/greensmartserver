const router = require('express').Router()

const clientControler = require('./clientController')

router.get('/', clientControler.webclient)

module.exports = router
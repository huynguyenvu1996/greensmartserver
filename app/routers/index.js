const router = require('express').Router()

const agriculturalProductRouter = require('./agriculturalProduct')
const notificationsRouter = require('./notifications')
const weatherRouter = require('./weather')
const openWeatherRouter = require('./openWeather')
const clientController = require('../controllers/clientController')

router.use('/agricultural-product', agriculturalProductRouter)
router.use('/notifications', notificationsRouter)
router.use('/weather', weatherRouter)
router.use('/open-weather', openWeatherRouter)
router.use(clientController.webclient)

module.exports = router
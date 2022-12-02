const express = require('express')
const { processPayment } = require('../controllers/paymentController')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth')

router.route('/process').post(processPayment)

module.exports = router

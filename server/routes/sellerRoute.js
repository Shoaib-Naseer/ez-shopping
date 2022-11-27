require('dotenv').config()
const router = require('express').Router()
const { isAuthenticated, isSeller } = require('../middleware/auth')

const {
    getDashboardStats,
    getOrders,
    getProducts,
} = require('../controllers/sellerController')

// router.get('/', isAuthenticated, isSeller, getDashboardStats)

router.get('/products', isAuthenticated, isSeller, getProducts)

// router.get('/orders', isAuthenticated, isSeller, getOrders)

module.exports = router

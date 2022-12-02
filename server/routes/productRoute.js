const router = require('express').Router()
const upload = require('../config/multer')
const { isAuthenticated, isAdmin, isSeller } = require('../middleware/auth')
const {
    getProducts,
    getCategoryProducts,
    getGenderProducts,
    getProduct,
    getTopProducts,
    addProductReview,
    editProduct,
    createProduct,
    deleteProduct,
    imageSearch,
} = require('../controllers/productsController')

router.get('/category', getCategoryProducts)

router.get('/gender', getGenderProducts)

router.get('/top', getTopProducts)

router.get('/', getProducts)
router.post('/imageSearch', imageSearch)

router.post('/', isAuthenticated, isSeller, upload.any('images'), createProduct)

router.get('/:id', getProduct)

router.put('/:id', isAuthenticated, isSeller, upload.any('images'), editProduct)

router.delete('/:id', isAuthenticated, isAdmin || isSeller, deleteProduct)

router.post('/:id/reviews', isAuthenticated, addProductReview)

module.exports = router

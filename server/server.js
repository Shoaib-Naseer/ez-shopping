require('dotenv').config()

const cors = require('cors')
const path = require('path')
const express = require('express')
const expressStaticGzip = require('express-static-gzip')
const bodyParser = require('body-parser')
const payment = require('./routes/paymentRoute')

const connectDB = require('./config/connectDB')
connectDB()

const usersRoute = require('./routes/userRoute')
const productsRoute = require('./routes/productRoute')
const ordersRoute = require('./routes/orderRoute')
const adminRoute = require('./routes/adminRoute')
const sellerRoute = require('./routes/sellerRoute')

const { errorHandler, notFound } = require('./middleware/errorMiddleware')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
app.use('/api/users', usersRoute)
app.use('/api/products', productsRoute)
app.use('/api/orders', ordersRoute)
app.use('/api/admin', adminRoute)
app.use('/api/seller', sellerRoute)
app.use('/api/payment', payment)

app.get('/api/config/paystack', (req, res) =>
    res.send(process.env.PAYSTACK_PUBLIC)
)

const __currentDirectory = path.resolve()

if (process.env.NODE_ENV === 'production') {
    // app.use(express.static(path.join(__currentDirectory, '/client/build')));

    app.use(
        '/',
        expressStaticGzip(path.join(__currentDirectory, '/client/build'))
    )

    app.get('/*', function (req, res) {
        res.sendFile(
            path.resolve(__currentDirectory, 'client', 'build', 'index.html')
        )
    })
}

app.use(errorHandler)
app.use(notFound)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

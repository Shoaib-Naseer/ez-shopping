require('dotenv').config()
const mongoose = require('mongoose')

var db = process.env.MONGO_URI

const connectDB = () => {
    mongoose.connect(db).then((data) => {
        console.log(`Mongodb  connected with Server : ${data.connection.host}`)
    })
}

module.exports = connectDB

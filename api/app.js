const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const feedRoutes = require('./routes/feed')

const app = express()

app.use(bodyParser.json())

app.use(cors())

app.use(express.json())

app.use('/feed', feedRoutes)

mongoose
  .connect('mongodb+srv://quantrung286:Trungquan2806@cluster0.uknlqmo.mongodb.net/messages?retryWrites=true&w=majority')
  .then(() => {
    console.log('http://localhost:8080/')
    app.listen(8080)
  })
  .catch((err) => console.log(err))

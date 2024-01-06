const path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const feedRoutes = require('./routes/feed')

const app = express()

app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(cors())

app.use(express.json())

app.use('/feed', feedRoutes)

app.use((error, req, res, next) => {
  console.log('error: ', error)
  const status = error.statusCode || 500
  const message = error.message
  res.status(status).json({ message: message })
})

mongoose
  .connect('mongodb+srv://quantrung286:Trungquan2806@cluster0.uknlqmo.mongodb.net/messages?retryWrites=true&w=majority')
  .then(() => {
    console.log('http://localhost:8080/')
    app.listen(8080)
  })
  .catch((err) => console.log(err))

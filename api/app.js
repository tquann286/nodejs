const path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')

const feedRoutes = require('./routes/feed')

const app = express()

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'api/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + '-' + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(bodyParser.json())
app.use(multer({ storage: fileStorage, fileFilter }).single('image'))
app.use('/api/images', express.static(path.join(__dirname, 'images')))

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

const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const { graphqlHTTP } = require('express-graphql')
const auth = require('./middleware/auth')
const helmet = require('helmet')
const compression = require('compression')

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
app.use(helmet())
app.use(compression())
app.use(express.json())

app.use(auth)

app.put('/post-image', (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('Not authenticated!')
  }

  if (!req.file) {
    return res.status(200).json({ message: 'No file provided!' })
  }
  if (req.body.oldPath) {
    clearImage(decodeURIComponent(req.body.oldPath))
  }
  return res.status(201).json({ message: 'File stored.', filePath: req.file.path })
})

app.use(
  '/graphql',
  graphqlHTTP({
    schema: require('./graphql/schema'),
    rootValue: require('./graphql/resolvers'),
    graphiql: true,
    customFormatErrorFn(err) {
      console.log('err: ', err)
      if (!err.originalError) {
        return err
      }
      const data = err.originalError.data
      const message = err.message || 'An error occurred.'
      const code = err.originalError.code || 500
      return { message, status: code, data }
    },
  })
)

app.use((error, req, res, next) => {
  console.log('error: ', error)
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({ message, data })
})

mongoose
  .connect('mongodb+srv://quantrung286:Trungquan2806@cluster0.uknlqmo.mongodb.net/messages?retryWrites=true&w=majority')
  .then(() => {
    // const server = app.listen(8080)
    // const io = require('./socket').init(server)

    // io.on('connection', (socket) => {
    //   console.log('a user connected')
    // })
    console.log('http://localhost:8080')
    app.listen(8080)
  })
  .catch((err) => console.log(err))

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath)
  console.log('filePath: ', filePath)
  fs.unlink(filePath, (err) => console.log(err))
}

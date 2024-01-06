const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const feedRoutes = require('./routes/feed')

const app = express()

app.use(bodyParser.json())

app.use(cors())

app.use(express.json())

app.use('/feed', feedRoutes)


app.listen(8080, () => {
  console.log('http://localhost:8080/')
})

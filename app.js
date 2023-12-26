const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')
const shopRoutes = require('./routes/shop')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false }))

app.use((req, res, next) => {
  req.isLoggedIn = req.cookies.loggedIn === 'true'
  User.findById('65897f5010e884d405bae320')
    .then((user) => {
      req.user = user
      next()
    })
    .catch((err) => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)

mongoose
  .connect('mongodb+srv://quantrung286:Trungquan2806@cluster0.uknlqmo.mongodb.net/shop?retryWrites=true&w=majority')
  .then(() => {
    return User.findOne().then((user) => {
      if (!user) {
        const user = new User({ name: 'John', email: 'test', cart: { items: [] } })

        return user.save()
      }

      return Promise.resolve()
    })
  })
  .then(() => {
    console.log('http://localhost:3000/')
    app.listen(3000)
  })
  .catch((err) => console.log(err))

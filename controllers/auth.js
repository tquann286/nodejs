const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  })
}

exports.postLogin = (req, res, next) => {
  User.findById('65897f5010e884d405bae320')
    .then((user) => {
      req.session.isLoggedIn = true
      req.session.user = user
      req.session.save(() => {
        res.redirect('/')
      })
    })
    .catch((err) => console.log(err))
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  })
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect('/signup')
      }

      const user = new User({ email, password, cart: { items: [] } })

      return user.save()
    })
    .then(() => {
      res.redirect('/login')
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

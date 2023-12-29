const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

const User = require('../models/user')

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '68f531f49651a6',
    pass: '4653b6f7c1f7fe',
  },
})

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error'),
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password.')
        return res.redirect('/login')
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(() => {
              res.redirect('/')
            })
          }

          res.redirect('/login')
        })
        .catch((err) => {
          console.log('err: ', err)
          res.redirect('/login')
        })
    })
    .catch((err) => console.log(err))
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
  })
}

exports.postSignup = (req, res, next) => {
  const { email } = req.body
  const { password } = req.body
  const { confirmPassword } = req.body

  User.findOne({ email }).then((userDoc) => {
    if (userDoc) {
      return res.redirect('/signup')
    }

    return bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          cart: { items: [] },
        })

        return user.save()
      })
      .then(() => {
        res.redirect('/login')
        transporter.sendMail({
          to: email,
          from: 'quantrung@gmail.com',
          subject: 'Signup succeeded!',
          html: '<h1>You successfully signed up!</h1>',
        })
      })
  })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: req.flash('error'),
  })
}

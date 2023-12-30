const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { validationResult } = require('express-validator')

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
          res.redirect('/login')
        })
    })
    .catch((err) => console.log(err))
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: '',
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  })
}

exports.postSignup = (req, res, next) => {
  const { email } = req.body
  const { password } = req.body
  const { confirmPassword } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
        confirmPassword,
      },
      validationErrors: errors.array(),
    })
  }

  bcrypt
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

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex')
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with that email found.')
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save()
      })
      .then((result) => {
        if (result) {
          res.redirect('/')
          transporter.sendMail({
            to: req.body.email,
            from: 'shop@node-complete.com',
            subject: 'Password reset',
            html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                  `,
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

exports.getNewPassword = (req, res, next) => {
  const { token } = req.params
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }).then((user) => {
    if (!user) {
      return res.redirect('/login')
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: req.flash('error'),
      userId: user._id.toString(),
      passwordToken: token,
    })
  })
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password
  const userId = req.body.userId
  const passwordToken = req.body.passwordToken

  User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
    .then((user) => {
      return bcrypt
        .hash(newPassword, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword
          user.resetToken = undefined
          user.resetTokenExpiration = undefined
          return user.save()
        })
        .then(() => {
          res.redirect('/login')
        })
    })
    .catch((err) => {
      console.log('err: ', err)
    })
}

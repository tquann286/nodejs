const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const { validationResult } = require('express-validator')

exports.signup = (req, res, next) => {
  const error = validationResult(req)

  if (!error.isEmpty()) {
    const error = new Error('Validation failed.')
    error.statusCode = 422
    error.data = error.array()
    throw error
  }

  const email = req.body.email
  const password = req.body.password
  const name = req.body.name

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        const error = new Error('Email address already exists!')
        error.statusCode = 422
        error.data = [{ param: 'email', msg: 'Email address already exists!' }]
        throw error
      }

      return bcrypt.hash(password, 12)
    })
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      })

      return user.save()
    })
    .then((result) => {
      res.status(201).json({ message: 'User created!', userId: result._id })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.login = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  let loadedUser
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error('A user with this email could not be found.')
        error.statusCode = 401
        throw error
      }

      loadedUser = user
      return bcrypt.compare(password, user.password)
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Wrong password!')
        error.statusCode = 401
        throw error
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        'somesupersecretsecret',
        { expiresIn: '1h' }
      )

      res.status(200).json({ token, userId: loadedUser._id.toString() })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

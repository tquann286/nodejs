const jwt = require('jsonwebtoken')

const User = require('../models/user')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')

  if (!authHeader) {
    req.isAuth = false
    return next()
  }

  const token = authHeader.split(' ')[1]
  let decodedToken

  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret')
  } catch (err) {
    req.isAuth = false
    return next()
  }

  if (!decodedToken) {
    req.isAuth = false
    return next()
  }

  User.findById(decodedToken.userId)
    .then((user) => {
      if (!user) {
        const error = new Error('No user found.')
        error.statusCode = 404
        throw error
      }

      req.userId = decodedToken.userId
      req.isAuth = true
      next()
    })
    .catch((err) => {
      err.statusCode = 500
      next(err)
    })
}

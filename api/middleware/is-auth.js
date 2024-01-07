const jwt = require('jsonwebtoken')

const User = require('../models/user')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')

  if (!authHeader) {
    const error = new Error('Not authenticated.')
    error.statusCode = 401
    throw error
  }

  const token = authHeader.split(' ')[1]
  let decodedToken

  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret')
  } catch (err) {
    err.statusCode = 500
    throw err
  }

  if (!decodedToken) {
    const error = new Error('Not authenticated.')
    error.statusCode = 401
    throw error
  }

  User.findById(decodedToken.userId)
    .then((user) => {
      if (!user) {
        const error = new Error('No user found.')
        error.statusCode = 404
        throw error
      }

      req.userId = decodedToken.userId
      next()
    })
    .catch((err) => {
      err.statusCode = 500
      next(err)
    })
}

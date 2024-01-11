const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')

module.exports = {
  createUser: async function ({ userInput }, req) {
    const { email, name, password } = userInput

    const errors = []
    if (!validator.isEmail(email)) {
      errors.push({ message: 'E-Mail is invalid.' })
    }
    if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
      errors.push({ message: 'Password too short!' })
    }

    if (errors.length > 0) {
      const error = new Error('Invalid input.')
      error.data = errors
      error.code = 422
      throw error
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const error = new Error('User exists already!')
      throw error
    }
    const hashedPw = await bcrypt.hash(password, 12)
    const user = new User({
      email,
      name,
      password: hashedPw,
    })
    const createdUser = await user.save()

    return { ...createdUser._doc, _id: createdUser._id.toString() }
  },
  login: async function ({ email, password }) {
    const user = await User.findOne({ email })

    if (!user) {
      const error = new Error('User not found.')
      error.code = 401
      throw error
    }

    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      const error = new Error('Password is incorrect.')
      error.code = 401
      throw error
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    )

    return { token, userId: user._id.toString() }
  },
}

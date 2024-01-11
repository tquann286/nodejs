const bcrypt = require('bcryptjs')

const User = require('../../models/user')

module.exports = {
  createUser: async function ({ userInput }, req) {
    const email = userInput.email
    const name = userInput.name

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const error = new Error('User exists already!')
      throw error
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12)
    const user = new User({
      email,
      name,
      password: hashedPw,
    })
    const createdUser = await user.save()

    return { ...createdUser._doc, _id: createdUser._id.toString() }
  },
}

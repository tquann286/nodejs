exports.signup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const name = req.body.name

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        const error = new Error('Email address already exists!')
        error.statusCode = 422
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

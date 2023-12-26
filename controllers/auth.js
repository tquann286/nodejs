exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.isLoggedIn,
  })
}

exports.postLogin = (req, res, next) => {
  req.session.loggedIn = true
  res.redirect('/')
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

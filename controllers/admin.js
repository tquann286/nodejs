const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    isAuthenticated: req.session.isLoggedIn,
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title } = req.body
  const { imageUrl } = req.body
  const { price } = req.body
  const { description } = req.body
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  })

  product
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId)
    .then((product) => {
      if (!product) return res.redirect('/')

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode === 'true',
        product,
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body

  Product.findOneAndUpdate({ _id: productId, userId: req.user._id }, { title, price, imageUrl, description })
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId
  if (!prodId) {
    return res.redirect('/')
  }
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch((err) => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .populate('userId')
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => console.log(err))
}

const Product = require('../models/product')
const { validationResult } = require('express-validator')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title } = req.body
  const image = req.file
  const imageUrl = image ? image.path : null
  const { price } = req.body
  const { description } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    })
  }

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
    .catch((err) => {
      return res.status(500).render('500', {
        pageTitle: 'Error',
        path: '/500',
      })
    })
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
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      })
    })
    .catch((err) => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description } = req.body
  const image = req.file
  const imageUrl = image ? image.path : null

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing: true,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
        _id: productId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    })
  }

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

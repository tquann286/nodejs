const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      })
    })
    .catch((err) => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId

  Product.findById(prodId)
    .then((product) => {
      console.log('product: ', product)
      if (!product) return res.redirect('/')

      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      })
    })
    .catch((err) => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.find().then((products) => {
    res.render('shop/index', {
      prods: products || [],
      pageTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      })
    })
    .catch((err) => console.log(err))
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  req.user
    .deleteCartItem(prodId)
    .then(() => {
      res.redirect('/cart')
    })
    .catch((err) => console.log(err))
}

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => res.redirect('/orders'))
    .catch((err) => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then((orders) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders,
    })
  })
}

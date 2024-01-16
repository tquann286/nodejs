const fs = require('fs')
const path = require('path')
const stripe = require('stripe')(process.env.STRIPE_KEY)

const PDFDocument = require('pdfkit')

const Product = require('../models/product')
const Order = require('../models/order')

const ITEMS_PER_PAGE = 2

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1
  let totalItems = 0
  let totalPages = 0
  Product.countDocuments()
    .then((numProducts) => {
      totalItems = numProducts
      totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then((products) => {
      res.render('shop/product-list', {
        prods: products || [],
        pageTitle: 'All Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: totalPages,
      })
    })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId

  Product.findById(prodId)
    .then((product) => {
      if (!product) return res.redirect('/')

      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => console.log(err))
}

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1
  let totalItems = 0
  let totalPages = 0
  Product.countDocuments()
    .then((numProducts) => {
      totalItems = numProducts
      totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then((products) => {
      res.render('shop/index', {
        prods: products || [],
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: totalPages,
      })
    })
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user?.cart?.items

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn,
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
    .removeFromCart(prodId)
    .then(() => {
      res.redirect('/cart')
    })
    .catch((err) => console.log(err))
}

exports.getCheckout = (req, res, next) => {
  let products
  let total = 0

  req.user
    .populate('cart.items.productId')
    .then((user) => {
      products = user?.cart?.items
      total = products?.reduce((acc, curr) => acc + curr.quantity * curr.productId.price, 0)

      return stripe.checkout.sessions.create({
        line_items: products.map((p) => {
          return {
            price_data: {
              currency: 'vnd',
              unit_amount: parseInt(p.productId.price),
              product_data: {
                name: p.productId.title,
                description: p.productId.description,
              },
            },
            quantity: p.quantity,
          }
        }),

        mode: 'payment',

        success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000,

        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
      })
    })
    .then((session) => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        sessionId: session.id,
      })
    })
    .catch((err) => console.log(err))
}

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = (user?.cart?.items || []).map((i) => ({
        quantity: i.quantity,
        product: { ...i?.productId?._doc },
      }))

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products,
      })

      return order.save()
    })
    .then(() => req.user?.clearCart())
    .then(() => res.redirect('/orders'))
    .catch((err) => console.log(err))
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id }).then((orders) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders,
      isAuthenticated: req.session.isLoggedIn,
    })
  })
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId

  Order.findById(orderId)
    .then((order) => {
      if (!order) return next(new Error('No order found.'))

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'))
      }

      const invoiceName = `invoice-${orderId}.pdf`
      const invoicePath = path.join('data', 'invoices', invoiceName)

      const pdfDoc = new PDFDocument()
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`)
      pdfDoc.pipe(fs.createWriteStream(invoicePath))
      pdfDoc.pipe(res)

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true,
      })

      pdfDoc.text('-----------------------')

      let totalPrice = 0
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price
        pdfDoc.fontSize(14).text(`${prod.product.title} - ${prod.quantity} x $${prod.product.price}`)
      })

      pdfDoc.text('---')
      pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`)

      pdfDoc.end()
    })
    .catch((err) => next(err))
}

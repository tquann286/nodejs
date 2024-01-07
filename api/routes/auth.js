const express = require('express')

const router = express.Router()

const { body } = require('express-validator')

const authController = require('../controllers/auth')

router.put('/signup', [body('email').isEmail().withMessage('Please enter a valid email.'), body('password').trim().isLength({ min: 5 }), body('name').trim().not().isEmpty()], authController.signup)

module.exports = router

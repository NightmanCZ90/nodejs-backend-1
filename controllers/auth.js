const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const User = require('../models/user')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '',
  }
}))

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: req.flash('error'),
  })
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: req.flash('error'),
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password')
        return req.session.save(err => {
          res.redirect('/login')
        })
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save((err) => {
              console.log(err)
              res.redirect('/')
            })
          }
          req.flash('error', 'Invalid email or password')
          res.redirect('/login')
        })
        .catch(err => {
          console.log(err)
          res.redirect('/login')
        })
    })
    .catch(err => console.log(err))
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email already exists. Please pick a different email.')
        return res.redirect('/signup')
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          })
          return user.save()
        })
        .then(result => {
          res.redirect('/')
          return transporter.sendMail({
            to: email,
            from: 'shop@node-backend.com',
            subject: 'Signup succeeded',
            html: '<h1>You successfully signed up</h1>'
          })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}
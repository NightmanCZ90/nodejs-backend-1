const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator')
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
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
    })
  }
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
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
    })
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
        from: 'novak.jan90@gmail.com',
        subject: 'Signup succeeded',
        html: '<h1>You successfully signed up</h1>'
      })
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: req.flash('error'),
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex')
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with this email found')
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save()
      })
      .then(result => {
        if (result) {
          res.redirect('/')
          transporter.sendMail({
            to: req.body.email,
            from: 'novak.jan90@gmail.com',
            subject: 'Password Reset',
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3090/reset/${token}">link</a> to set a new password</p>
            `
          })
        }
      })
      .catch(err => console.log(err))
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        errorMessage: req.flash('error'),
        userId: user._id.toString(),
        passwordToken: token,
      })
    })
    .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body
  let resetUser

  User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
    .then(user => {
      resetUser = user
      return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword
      resetUser.resetToken = null
      resetUser.resetTokenExpiration = null
      return resetUser.save()
    })
    .then(result => {
      res.redirect('/login')
    })
    .catch(err => console.log(err))
}
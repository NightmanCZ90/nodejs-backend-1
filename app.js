const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//   User.findById('61ad468bc85fe7d141346918')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id)
//       next()
//     })
//     .catch(err => console.log(err))
// })

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose.connect('mongodb+srv://NightmanCZ90:<password>@cluster0.a0hh5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(result => {
    console.log('Connected!')
    app.listen(3090)
  })
  .catch(err => console.log(err))
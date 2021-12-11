const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const path = require('path')
const errorController = require('./controllers/error')
const User = require('./models/user')

const MONGODB_URI = 'mongodb+srv://NightmanCZ90:<password>@cluster0.a0hh5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
})

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store, }))

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)

mongoose.connect(MONGODB_URI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Jan',
          email: 'jannovak@gmail.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
    console.log('Connected!')
    app.listen(3090)
  })
  .catch(err => console.log(err))
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price} = req.body
  const product = new Product({ title, price, description, imageUrl, userId: req.user })
  product.save()
    .then(result => {
      console.log('Created Product: ', title)
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
  
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body
  Product.findById(productId)
    .then(product => {
      return product.update({ title, price, description, imageUrl })
    })
    .then(result => {
      console.log('Updated Product')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body
  Product.findByIdAndRemove(productId)
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch(err => console.log(err))
}
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price} = req.body
  req.user.createProduct({ title, price, imageUrl, description })
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
  req.user.getProducts({ where: { id: prodId }})
    .then(products => {
      const product = products[0]
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body
  Product.findByPk(productId)
    .then(product => {
      product.title = title
      product.price = price
      product.imageUrl = imageUrl
      product.description = description
      return product.save()
    })
    .then(result => {
      console.log('Updated Product')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body
  Product.destroy({ where: { id: productId } })
    .then(result => {
      console.log('Destroyed Product')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin products',
        path: '/admin/products',
      })
    })
    .catch(err => console.log(err))
}
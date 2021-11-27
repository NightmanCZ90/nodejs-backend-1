const fs = require('fs')
const path = require('path')

const p = path.join(__dirname, '..', 'data', 'products.json')

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([])
    }
    cb(JSON.parse(fileContent))
  })
}

module.exports = class Product {
  constructor(title) {
    this.title = title
  }

  // class method on instantiated object
  save() {
    getProductsFromFile((products) => {
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err)
      })
    })
  }

  // static keyword allows us to call the method on this class without instantiating it - Product.fechtAll
  static async fetchAll(cb) {
    getProductsFromFile(cb)
  }
}
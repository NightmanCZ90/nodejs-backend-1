const fs = require('fs')
const path = require('path')

module.exports = class Product {
  constructor(title) {
    this.title = title
  }

  // class method on instantiated object
  save() {
    const p = path.join(__dirname, '..', 'data', 'products.json')
    fs.readFile(p, (err, fileContent) => {
      let products = []
      if (!err) {
        products = JSON.parse(fileContent)
      }
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err)
      })
    })

  }

  // static keyword allows us to call the method on this class without instantiating it - Product.fechtAll
  static async fetchAll(cb) {
    const p = path.join(__dirname, '..', 'data', 'products.json')
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([])
      }
      cb(JSON.parse(fileContent))
    })
  }
}
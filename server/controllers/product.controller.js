import Product from './../models/product.model';
import formidable from 'formidable';
import fs from 'fs';
import dbErrorHandler from '../helpers/dbErrorHandler';
import defaultImage from '../../client/assets/images/default_product.jpg';
import { extend } from 'lodash';

const create = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
            message: "Image could not be uploaded"
            })
        }

        let product = new Product(fields)
        product.recorded_by = req.auth

        if(files.image){
            product.image.data = fs.readFileSync(files.image.path)
            product.image.contentType = files.image.type
        }
        try {
            let result = await product.save()
            res.json(result)
        } catch (err){
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}
  
const productByID = async (req, res, next, id) => {
    try {
        let product = await Product.findById(id).populate('shop', '_id name').exec()
        if (!product) {
            return res.status(400).json({
                error: 'Product not found'
            })
        }
        req.product = product
        next()
    } catch(err) {
        return res.status(400).json({
            error: 'Could not retrieve product'
        })
    }
}

const photo = (req, res, next) => {
    if (req.product.image.data) {
        res.set("Content-Type", req.product.image.contentType)
        return res.send(req.product.image.data)
    }
    next()
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + defaultImage)
}

const read = (req, res) => {
    let product = req.product
    product.image = undefined
    return res.json(product)
}

const update = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                message: 'Photo could not be uploaded'
            })
        }
        let product = req.product
        product = extend(product, fields)
        product.updated = Date.now()

        if (files.image) {
            product.image.data = fs.readFileSync(files.image.path)
            product.image.contentType = files.image.type
        }
        try {
            let result = await product.save()
            res.json(result)
        } catch (err) {
            return res.status(400).json({
                error: dbErrorHandler.getErrorMessage(err)
            })
        }
    })
}

const remove = async (req, res) => {
    try {
        let product = req.product
        let deleteProduct = await product.remove()
        res.json(deleteProduct)
    } catch(err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

// const listByShop = async (req, res) => {
//     try {
//         let products = await Product.find({'shop': req.shop._id}).populate('shop', '_id name').select('-image')
//         res.json(products)
//     } catch (err) {
//         return res.status(400).json({
//             error: dbErrorHandler.getErrorMessage(err)
//         })
//     }
// }

const listLatest = async (req, res) => {
    try {
        // let products = await Product.find({}).sort('-created').limit(5).populate('shop', '_id name').exec()
        let products = await Product.find({}).sort('-created').limit(5).exec()
        res.json(products)
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

const listRelated = async (req, res) => {
    try {
        // let products = await Product.find({'_id': {"$ne": req.product}, 'category': req.product.category}).limit(5).populate('shop', '_id name').exec()
        let products = await Product.find({'_id': {"$ne": req.product}, 'category': req.product.category}).limit(5).exec()
        res.json(products)
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

const listCategories = async (req, res) => {
    try {
        let products = await Product.distinct('category', {})
        res.json(products)
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

const list = async (req, res) => {
    let query = {}
    if (req.query.search) {
        query.name = {"$regex": req.query.search, "$options": "i"}
    }
    if (req.query.category && req.query.category != 'All'){
        query.category = req.query.category
    }
    try {
        // let products = await Product.find(query).populate('shop', '_id name').select('-image').exec()
        let products = await Product.find(query).select('-image').exec()
        res.json(products)
    } catch (err) {
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}


const decreaseQuantity = async (req, res, next) => {
    let bulkOps = req.body.order.products.map((item) => {
      return {
          "updateOne": {
              "filter": { "_id": item.product._id } ,
              "update": { "$inc": {"quantity": -item.quantity} }
          }
      }
     })
     try {
       await Product.bulkWrite(bulkOps, {})
       next()
     } catch (err){
        return res.status(400).json({
          error: "Could not update product"
        })
     }
  }
  
  const increaseQuantity = async (req, res, next) => {
    try {
      await Product.findByIdAndUpdate(req.product._id, {$inc: {"quantity": req.body.quantity}}, {new: true})
      .exec()
        next()
    } catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }
  

export default {
    create,
    productByID,
    photo,
    defaultPhoto,
    read,
    update,
    remove,
    // listByShop,
    listLatest,
    listRelated,
    listCategories,
    list,
    decreaseQuantity,
    increaseQuantity
}
import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'


const isAdmin = async (req, res, next) => {
    const isAdmin = req.profile && req.auth && req.profile._id == req.auth._id && req.profile.admin
    console.log("isAdmin: ", isAdmin);
    if (!isAdmin) {
        return res.status(403).json({
            error: "User is not a Admin"
        })
    }
    next()
  }
  

const create = async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status('400').json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created')
        return res.json(users)
    } catch (err) {
        return res.status('400').json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const userById = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if (!user) 
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        console.log("req.profile: ", req.profile);
        next()
    } catch (err) {
        return res.status('400').json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const read = async (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}
const update = async (req, res) => {
    try {
        let user = req.profile
        user = extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        return res.json(user)
    } catch (err) {
        res.status('400').json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const remove = async (req, res) => {
    try {       
        let user = req.profile
        let delateUser = await user.remove()
        delateUser.hashed_password = undefined
        delateUser.salt = undefined
        return res.json(delateUser)
        } catch (err) {
            return res.status('400').json({
                error: errorHandler.getErrorMessage(err)
            })
        }
}

export default { isAdmin, create, list, userById, read, update, remove }
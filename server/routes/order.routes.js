import express from 'express'
import orderCtrl from '../controllers/order.controller'
import productCtrl from '../controllers/product.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

router.route('/api/orders/:userId')
  .post(authCtrl.requireSignin, productCtrl.decreaseQuantity, orderCtrl.create)

router.route('/api/orders/user/:userId')
  .get(authCtrl.requireSignin, orderCtrl.listByUser)

router.route('/api/order/status_values')
  .get(orderCtrl.getStatusValues)

router.route('/api/order/cancel/:productId')
  .put(authCtrl.requireSignin, productCtrl.increaseQuantity, orderCtrl.update)

// router.route('/api/order/:orderId/charge/:userId/:shopId')
//   .put(authCtrl.requireSignin, shopCtrl.isOwner, userCtrl.createCharge, orderCtrl.update)

router.route('/api/order/status')
  .put(authCtrl.requireSignin, orderCtrl.update)

router.route('/api/order/:orderId')
  .get(orderCtrl.read)

router.route('/api/orders/admin/:userId')
  .get(authCtrl.requireSignin, userCtrl.isAdmin, orderCtrl.list)
  
router.param('userId', userCtrl.userById)
router.param('productId', productCtrl.productByID)
router.param('orderId', orderCtrl.orderByID)

export default router
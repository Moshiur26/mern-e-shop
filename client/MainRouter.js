import React from 'react'
import {Route, Switch} from 'react-router-dom'
// import PrivateRoute from './auth/PrivateRoute'
import PrivateRoute from './auth/PrivateRoute'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';
import Menu from './core/Menu';
import Product from './product/Product'
import NewProduct from './product/NewProduct'
import EditProduct from './product/EditProduct'
import MyShop from './shop/MyShop'
import Cart from './cart/Cart'
import Order from './order/Order'
import ShopOrders from './order/ShopOrders'

const MainRouter = () => {
    return (<div>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home}/>
        <PrivateRoute path="/users" component={Users}/>

        {/* <Route path="/users" component={Users}/> */}
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={Signin}/>
        <Route path="/user/edit/:userId" component={EditProfile}/>
        <Route path="/user/:userId" component={Profile}/>

        <Route path="/product/:productId" component={Product}/>

        <Route path="/order/:orderId" component={Order}/>
        <PrivateRoute path="/seller/orders" component={ShopOrders}/>

        <PrivateRoute path="/seller/myShop" component={MyShop}/>
        <PrivateRoute path="/seller/products/new" component={NewProduct}/>
        <PrivateRoute path="/seller/:productId/edit" component={EditProduct}/>

        <Route path="/cart" component={Cart}/>

      </Switch>
    </div>)
}

export default MainRouter
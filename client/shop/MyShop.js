import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import {Link, Redirect} from 'react-router-dom'
import Products from './../product/Products'
import {list} from './../product/api-product.js'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    textAlign: 'center',
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing(1),
    color: theme.palette.openTitle
  },
  addButton:{
    float:'right',
    margin: 5
  },
  bigAvatar: {
    width: 100,
    height: 100,
    margin: 'auto'
  },
  productTitle: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    width: '100%',
    fontSize: '1.2em'
  }
}))

export default function Shop({match}) {
  const classes = useStyles();
  const [shop, setShop] = useState('')
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list({
      shopId: match.params.shopId
    }, signal).then((data)=>{
      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data)
      }
    })
    // read({
    //   shopId: match.params.shopId
    // }, signal).then((data) => {
    //   if (data.error) {
    //     setError(data.error)
    //   } else {
    //     setShop(data)
    //   }
    // })

    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.shopId])
//   useEffect(() => {
//     const abortController = new AbortController()
//     const signal = abortController.signal

//     list({
//       shopId: match.params.shopId
//     }, signal).then((data)=>{
//       if (data.error) {
//         setError(data.error)
//       } else {
//         setProducts(data)
//       }
//     })

//     return function cleanup(){
//       abortController.abort()
//     }

//   }, [match.params.shopId])

    // const logoUrl = shop._id
    //       ? `/api/shops/logo/${shop._id}?${new Date().getTime()}`
    //       : '/api/shops/defaultphoto'

    return (<div className={classes.root}>
      <Grid container spacing={8}>
        <div>
          <span className={classes.addButton}>
            <Link to="/seller/products/new">
              <Button color="primary" variant="contained">
                <Icon className={classes.leftIcon}>add_box</Icon>  New Product
              </Button>
            </Link>
          </span>
          <span className={classes.addButton}>
            <Link to="/seller/orders">
              <Button color="primary" variant="contained">
                All Orders
              </Button>
            </Link>
          </span>
        </div>
        <Grid item xs={4} sm={4}>
        
          {/* <Card className={classes.card}>
            <CardContent>
              <Typography type="headline" component="h2" className={classes.title}>
                {shop.name}
              </Typography>
              <br/>
              <Avatar src={logoUrl} className={classes.bigAvatar}/><br/>
                <Typography type="subheading" component="h2" className={classes.subheading}>
                  {shop.description}
                </Typography><br/>
            </CardContent>
          </Card> */}
        </Grid>
        <Grid item xs={8} sm={8}>
          <Card>
            <Typography type="title" component="h2" className={classes.productTitle}>Products</Typography>
            <Products products={products} searched={false}/>
          </Card>
        </Grid>
      </Grid>
    </div>)
}

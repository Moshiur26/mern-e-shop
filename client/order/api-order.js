const create = async (params, credentials, order) => {
    try {
      let response = await fetch('/api/orders/'+params.userId, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
          },
          body: JSON.stringify({order: order})
        })
        //   body: JSON.stringify({order: order, token:token})
        return response.json()
      }catch(err) {
        console.log(err)
      }
  }
  
  const list = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/orders/admin/' + params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    }catch(err){
      console.log(err)
    }
  }
  
  const update = async (credentials, product) => {
    try {
      let response = await fetch('/api/order/status/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(product)
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
  }
  
  const cancelProduct = async (params, credentials, product) => {
    try {
      let response = await fetch('/api/order/cancel/'+params.productId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(product)
      })
      return response.json()
    }catch(err){
      console.log(err)
    }
  }
  
  const processCharge = async (params, credentials, product) => {
    // try {
    //   let response = await fetch('/api/order/'+params.orderId+'/charge/'+params.userId+'/'+params.shopId, {
    //     method: 'PUT',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer ' + credentials.t
    //     },
    //     body: JSON.stringify(product)
    //   })
    //   return response.json()
    // } catch(err) {
    //   console.log(err)
    // }
  }
  
  const getStatusValues = async (signal) => {
    try {
      let response = await fetch('/api/order/status_values', {
        method: 'GET',
        signal: signal
      })
      return response.json()
    }catch(err) { 
      console.log(err)
    }
  }
  
  const listByUser = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/orders/user/'+params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
  }
  
  const read = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/order/' + params.orderId, {
        method: 'GET',
        signal: signal
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  export {
    create,
    list,
    update,
    cancelProduct,
    processCharge,
    getStatusValues,
    listByUser,
    read
  }
  
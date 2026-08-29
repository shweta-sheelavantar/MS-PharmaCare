async function testOrder() {
  try {
    let loginRes = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'testrazorpay3@example.com',
            password: 'Password@123'
        })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    
    const orderRes = await fetch('http://localhost:8080/api/orders', {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
          totalAmount: 500,
          shippingAddress: '123 Test St',
          paymentMethod: 'RAZORPAY',
          items: [
            { productId: 1, quantity: 1, price: 500 }
          ]
      })
    });
    
    const text = await orderRes.text();
    console.log("Order Status:", orderRes.status);
    console.log("Response text:", text);
  } catch (err) {
    console.error(err);
  }
}

testOrder();

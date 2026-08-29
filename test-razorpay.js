async function testDirectRazorpay() {
  try {
    const keyId = 'rzp_test_TKBJBTzypzCqBM';
    const keySecret = 'flu8SIyZJloSCaCgQXCaoth6';
    const credentials = Buffer.from(keyId + ':' + keySecret).toString('base64');
    
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({
        amount: 50000,
        currency: "INR",
        receipt: "receipt#1"
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch (err) {
    console.error(err);
  }
}
testDirectRazorpay();

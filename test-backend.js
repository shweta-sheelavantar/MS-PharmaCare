async function testBackend() {
  try {
    const baseURL = 'http://localhost:8080/api';

    // 1. Register a test user
    const email = `testuser_${Date.now()}@test.com`;
    console.log('Registering:', email);
    await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: 'Test User',
        email: email,
        mobileNumber: `98${Math.floor(Math.random() * 100000000)}`,
        password: 'Password@123',
        confirmPassword: 'Password@123',
        role: 'CUSTOMER'
      })
    });
    
    // 2. Login
    console.log('Logging in');
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: 'Password@123'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.data?.token;
    console.log('Got token:', token ? 'yes' : 'no');
    if (!token) return;

    // 3. Get products
    const productsRes = await fetch(`${baseURL}/products`);
    const products = await productsRes.json();
    const product = products[0];

    // 4. Add to Cart
    await fetch(`${baseURL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId: product.id })
    });

    // 5. Get Cart Items
    const cartItemsRes = await fetch(`${baseURL}/cart/items`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Cart Items JSON:', await cartItemsRes.text());

    // 6. Add to Wishlist
    await fetch(`${baseURL}/wishlist/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ product_id: product.id })
    });

    // 7. Get Wishlist Items
    const wishlistItemsRes = await fetch(`${baseURL}/wishlist/items`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Wishlist Items JSON:', await wishlistItemsRes.text());

  } catch (err) {
    console.error('Test failed:', err);
  }
}

testBackend();

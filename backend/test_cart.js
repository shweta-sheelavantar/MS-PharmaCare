async function test() {
    try {
        // 1. Login
        const loginRes = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'tanu7@gmail.com', password: 'Shweta@26' })
        });
        const loginData = await loginRes.json();
        const token = loginData.data.token;
        console.log('Logged in, token:', token.substring(0, 20) + '...');

        // 2. Add to cart (product 1)
        const addRes = await fetch('http://localhost:8080/api/cart/add', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId: 1, quantity: 1 })
        });
        const addData = await addRes.json();
        console.log('Add res:', addData.success);

        // 3. Get cart items
        let getRes = await fetch('http://localhost:8080/api/cart/items', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });
        let getData = await getRes.json();
        console.log('Cart items count after add:', getData.data.cart.products.length);

        // 4. Remove from cart (product 1)
        const rmRes = await fetch('http://localhost:8080/api/cart/delete/1', {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });
        const rmData = await rmRes.json();
        console.log('Rm res:', rmData.success);

        // 5. Get cart items
        getRes = await fetch('http://localhost:8080/api/cart/items', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });
        getData = await getRes.json();
        console.log('Cart items count after rm:', getData.data.cart.products.length);

    } catch(e) {
        console.error(e);
    }
}
test();

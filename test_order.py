import requests
import json

base_url = "https://ms-pharmacare.onrender.com/api"

# 1. Login or Register
print("Registering...")
res = requests.post(f"{base_url}/auth/register", json={"userName":"Test User","email":"test1@test.com","password":"password123","role":"CUSTOMER"})
print(res.status_code, res.text)
if res.status_code == 400:
    res = requests.post(f"{base_url}/auth/login", json={"email":"test1@test.com","password":"password123"})
    
token = res.json().get("token")

# 2. Get a product
res = requests.get(f"{base_url}/products")
products = res.json()
product = products[0]

# 3. Place an order
print("\nPlacing order...")
order_data = {
    "totalAmount": product['price'],
    "discount": 0,
    "gst": 0,
    "deliveryCharge": 0,
    "platformFee": 0,
    "shippingAddress": "123 Test St",
    "paymentMethod": "RAZORPAY",
    "items": [{
        "productId": product['id'],
        "quantity": 1,
        "price": product['price']
    }]
}

res = requests.post(f"{base_url}/orders", json=order_data, headers={"Authorization": f"Bearer {token}"})
print(res.status_code, res.text)

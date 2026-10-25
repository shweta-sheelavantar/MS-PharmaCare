import requests

base_url = "https://ms-pharmacare.onrender.com/api"

print("Logging in...")
res = requests.post(f"{base_url}/auth/login", json={"email":"test@example.com","password":"password123"})
print(res.status_code)
if res.status_code != 200:
    print("Registering...")
    res = requests.post(f"{base_url}/auth/register", json={"userName":"Test User","email":"test@example.com","password":"password123","role":"CUSTOMER"})
    res = requests.post(f"{base_url}/auth/login", json={"email":"test@example.com","password":"password123"})

token = res.json().get("token")
print("Token:", token[:10] + "...")

print("\nPlacing order...")
order_data = {
    "totalAmount": 100,
    "discount": 0,
    "gst": 0,
    "deliveryCharge": 0,
    "platformFee": 0,
    "shippingAddress": "123 Test St",
    "paymentMethod": "RAZORPAY",
    "items": [{
        "productId": 2,
        "quantity": 1,
        "price": 100
    }]
}

res = requests.post(f"{base_url}/orders", json=order_data, headers={"Authorization": f"Bearer {token}"})
print(res.status_code)
print(res.json())

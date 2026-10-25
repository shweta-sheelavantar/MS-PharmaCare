import requests
res = requests.post("https://ms-pharmacare.onrender.com/api/auth/register", json={
    "userName": "Admin User",
    "email": "admin@gmail.com",
    "password": "Password@123",
    "confirmPassword": "Password@123",
    "mobileNumber": "9999999999",
    "role": "ADMIN"
})
print("Status:", res.status_code)
print(res.text)

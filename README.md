# Registration & Login Service

Full-stack authentication service with **React**, **Spring Boot**, and **MySQL**.

## Features

- User Registration, Login, Logout
- Forgot Password (OTP verification)
- Reset Password & Change Password
- JWT authentication with server-side session management

## Project Structure

```
registerPage/
├── backend/     # Spring Boot REST API
└── frontend/    # React (Vite) UI
```

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

## Database Setup

1. Start MySQL
2. Update credentials in `backend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

3. Database `auth_db` is created automatically on first run.

## Run Backend

```bash
cd backend
mvn spring-boot:run
```

API runs at `http://localhost:8080`

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

UI runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login & get JWT |
| POST | `/api/auth/logout` | Yes | Invalidate session |
| POST | `/api/auth/forgot-password` | No | Send OTP |
| POST | `/api/auth/verify-otp` | No | Verify OTP |
| POST | `/api/auth/reset-password` | No | Reset password |
| POST | `/api/auth/change-password` | Yes | Change password |
| GET | `/api/auth/me` | Yes | Current user |

## Validation Rules

- **Full Name:** 3–10 alphabetic characters
- **Email:** Valid email format
- **Mobile:** Exactly 10 digits
- **Password:** Min 8 chars with uppercase, lowercase, digit, and special character

## OTP (Development)

In development, OTP is logged to the backend console:

```
Password reset OTP for user@example.com: 123456
```

## Test Flow

1. Register at `/register`
2. Login at `/login`
3. View dashboard at `/dashboard`
4. Change password from dashboard
5. Logout redirects to login
6. Forgot password → verify OTP (check backend logs) → reset password

## Environment Variables (Frontend)

Optional `.env` in `frontend/`:

```
VITE_API_URL=http://localhost:8080/api
```

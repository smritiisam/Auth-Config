# Auth Dashboard App

A backend-heavy Node.js application with JWT authentication, environment validation using Zod, and a simple dashboard interface.

## Features

- ✅ **Clean Architecture**: Config validation at boot time using Zod (not in controllers)
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **MongoDB Integration**: User data persistence
- ✅ **Registration & Login**: Complete user authentication flow
- ✅ **Protected Dashboard**: Access restricted to authenticated users
- ✅ **Dark Theme**: Modern UI with sky blue accents

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- Zod (environment validation)
- bcryptjs (password hashing)

### Frontend

- HTML5
- CSS3 (custom styling)
- Vanilla JavaScript

## Project Structure

```
/app/
├── backend-node/
│   ├── config/
│   │   └── env.js           # Zod config validation (validates at boot)
│   ├── models/
│   │   └── User.js          # User schema
│   ├── routes/
│   │   └── auth.js          # Authentication routes
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env                 # Environment variables
│
├── frontend-static/
│   ├── css/
│   │   └── style.css        # Styles
│   ├── js/
│   │   └── app.js           # Utility functions
│   ├── index.html           # Login page
│   ├── register.html        # Registration page

│   └── dashboard.html       # Dashboard (protected)
│
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)

### Step 1: Install Dependencies

```bash
cd /app/backend-node
npm install
```

### Step 2: Configure Environment Variables

Edit `/app/backend-node/.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth-dashboard-db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-at-least-32-characters
NODE_ENV=development
```

**Important Notes:**

- `JWT_SECRET` must be at least 32 characters (enforced by Zod)
- Change `MONGO_URI` if using MongoDB Atlas or different connection string
- The app will validate these on startup and exit if invalid

### Step 3: Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### Step 4: Start the Application

```bash
cd /app/backend-node
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### Step 5: Access the Application

Open your browser and navigate to:

```
http://localhost:5000
```

## API Endpoints

### Authentication Routes

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User (Protected)

```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

## Key Architecture Principles

### ✅ Config Validation at Boot (Clean Architecture)

**What we do RIGHT:**

```javascript
// config/env.js - Validates ONCE at boot time
const config = envSchema.parse(process.env);
module.exports = config;

// routes/auth.js - Uses validated config
const config = require("../config/env");
const token = jwt.sign(payload, config.JWT_SECRET);
```

**What we DON'T do (anti-pattern):**

```javascript
// ❌ NEVER do this - validating in controller
function loginController(req, res) {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "Config error" });
  }
  // ...
}
```

### Why This Matters

1. **Fail Fast**: App won't start with invalid config
2. **Clean Separation**: Configuration is infrastructure, not business logic
3. **Performance**: Validate once, not on every request
4. **Developer Experience**: Clear error messages at startup

## Security Features

- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ JWT tokens expire after 7 days
- ✅ Environment variables validated with strict schemas
- ✅ MongoDB injection protection via Mongoose
- ✅ Protected routes require valid JWT

## Testing the Application

### Manual Testing

1. **Register a new user** at `/register.html`
2. **Login** at `/` (index.html)
3. **View dashboard** - automatically redirected after login
4. **Test protected route** - try accessing `/dashboard.html` without token

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get user info (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Environment Validation

The app uses Zod to validate environment variables at startup:

- `PORT`: Must be a valid number (default: 5000)
- `MONGO_URI`: Required, non-empty string
- `JWT_SECRET`: Required, minimum 32 characters
- `NODE_ENV`: Must be 'development', 'production', or 'test'

If validation fails, the app will:

1. Display detailed error messages
2. Exit with code 1
3. Not start the server

## Troubleshooting

### App won't start

- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Ensure `JWT_SECRET` is at least 32 characters
- Check console for Zod validation errors

### Can't login

- Verify MongoDB connection
- Check if user exists in database
- Ensure password is at least 6 characters
- Check browser console for errors

### Token expired

- Login again to get a new token
- Tokens are valid for 7 days

## Support

For issues or questions, please check the error messages in:

- Browser console (frontend issues)
- Terminal/server logs (backend issues)
- MongoDB logs (database issues)

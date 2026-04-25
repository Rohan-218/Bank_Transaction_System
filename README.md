# Bank Transition System Backend

A bank transaction system backend using Express and MongoDB for user authentication and ledger-style account management.

## Tech stack

- Node.js
- Express 5
- MongoDB / Mongoose
- bcryptjs
- dotenv

## Project structure

- `src/server.js` - entry point that loads env variables, connects to MongoDB, and starts the server
- `src/app.js` - Express application setup and route registration
- `src/config/db.js` - MongoDB connection helper
- `src/routes/auth.routes.js` - authentication route scaffold
- `src/controllers/auth.controller.js` - auth controller placeholder
- `src/models/user.model.js` - user schema and password hashing logic

## Requirements

- Node.js 18+ recommended
- MongoDB instance or connection URI

## Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root with the following value:

```env
MONGO_URI=mongodb://localhost:27017/your-db-name
```

3. Start the app in development mode

```bash
npm run dev
```

Or start production-style:

```bash
npm start
```

The server listens on port `3000` by default.

## API

### Auth

- `POST /api/auth/register`

This route is defined in `src/routes/auth.routes.js` and is intended for creating new user accounts.

## Notes

- The current project includes a user model with bcrypt password hashing.
- The auth controller is prepared for bank user registration and can be extended with login, token handling, transaction history, and additional account management routes.

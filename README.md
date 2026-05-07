# Backend Ledger API

A backend service for a ledger-based banking system built with Express, MongoDB, and JWT authentication.

## Tech stack

- Node.js
- Express 5
- MongoDB / Mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cookie-parser
- nodemailer

## Project structure

- `src/server.js` - entry point that loads environment variables, connects to MongoDB, and starts the server
- `src/app.js` - Express application setup and route registration
- `src/config/db.js` - MongoDB connection helper
- `src/routes/auth.routes.js` - authentication routes for register, login, logout
- `src/routes/account.routes.js` - protected account endpoints
- `src/routes/transaction.routes.js` - transaction and system funding endpoints
- `src/controllers/` - controller logic for auth, account, and transaction actions
- `src/middleware/auth.middleware.js` - auth middleware for user and system authorization
- `src/models/` - Mongoose schemas for user, account, transaction, ledger, and blacklist data
- `src/services/email.service.js` - email helper for notifications or verification flows

## Requirements

- Node.js 18+ recommended
- MongoDB instance available
- `.env` with a valid MongoDB connection URI

## Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017/your-db-name
```

3. Start in development mode:

```bash
npm run dev
```

4. Or start production mode:

```bash
npm start
```

The server listens on port `3000` by default.

## Available scripts

- `npm run dev` - starts the server with `nodemon` watching `src/server.js`
- `npm start` - starts the server with `node src/server.js`
- `npm test` - placeholder test script

## API Endpoints

### Authentication

- `POST /api/auth/register` - create a new user account
- `POST /api/auth/login` - authenticate a user and issue a token/cookie
- `POST /api/auth/logout` - log out the current user

### Account management

- `POST /api/account/` - create a new account for the authenticated user
- `GET /api/account/` - fetch account details for the authenticated user
- `GET /api/account/balance/:accountId` - fetch the account balance for a specific account

### Transactions

- `POST /api/transactions/create` - create a new transaction for the authenticated user
- `POST /api/transactions/system/initial-funds` - initialize user account funds using system authorization

## Notes

- The application uses middleware to protect routes and distinguish normal user access from system-level authorization.
- The user model includes password hashing with `bcryptjs`.
- Additional functionality can be extended through controllers and routes for transaction history, balance updates, ledger entries, and email notifications.

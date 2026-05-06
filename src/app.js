const expres = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes");

const app = expres();

app.use(expres.json());
app.use(cookieParser());

/**
 * - API routes
 * - /api/auth for authentication related routes (register, login, logout)
 * - /api/account for account management related routes (get account details, update account details, delete account)
 * - /api/transaction for transaction management related routes (get transaction details, create transaction, update transaction, delete transaction)
 */
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/transactions", transactionRouter);

module.exports = app;
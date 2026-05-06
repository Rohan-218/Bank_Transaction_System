const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");

const transactionRouter = Router();


/** 
 * @route POST /api/transaction/create 
 * - create a new transaction for the authenticated user
*/
transactionRouter.post("/create", authMiddleware.authMiddleware, transactionController.createTransactionController);

/**
 * - @route POST /api/transaction/system/initial-funds
 * - initialize the user's account with initial funds
 */
transactionRouter.post("/system/initial-funds", authMiddleware.systemAuthMiddleware, transactionController.createInitialFundsController);

module.exports = transactionRouter;
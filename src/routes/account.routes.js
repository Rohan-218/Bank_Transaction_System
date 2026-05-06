const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accoutnController = require("../controllers/account.controller");

const router = express.Router();

/**
 * - POST /api/account/create 
 * - create a new account for the authenticated user
 * - Protected Route
*/
router.post("/", authMiddleware.authMiddleware, accoutnController.createAccountController);

/**
 * - GET /api/account/
 * - get account details for the authenticated user
 * - Protected Route
*/
router.get("/", authMiddleware.authMiddleware, accoutnController.getUserAccountController);

/**
 * - GET /api/account/balance/:accountId
 * - get account balance for the specified account
 * - Protected Route
*/
router.get("/balance/:accountId", authMiddleware.authMiddleware, accoutnController.getAccountBalanceController);

module.exports = router;
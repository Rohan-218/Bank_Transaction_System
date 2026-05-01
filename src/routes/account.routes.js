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


module.exports = router;
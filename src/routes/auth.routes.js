const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();


/** @route POST /api/auth/register */
router.post("/register", authController.userRegisterController);

/** @route POST /api/auth/login */
router.post("/login", authController.userLoginController);


module.exports = router;
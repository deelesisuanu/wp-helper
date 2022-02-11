const express = require("express");

const { createAccount, loginUser, refreshToken, resetPasswordRequest, validateResetCode, resetUserPassword } = require("../controllers/authController");

require("dotenv").config();

const router = express.Router();

router.route("/users").post(createAccount);
router.route("/users/login").post(loginUser);

router.route("/users/reset_password/:email").post(resetPasswordRequest);
router.route("/users/validate_code").post(validateResetCode);

router.route("/users/new_password").post(resetUserPassword);

router.route("/users/refresh").post(refreshToken);

module.exports = router;
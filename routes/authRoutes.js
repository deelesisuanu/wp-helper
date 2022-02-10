const express = require("express");

const { createAccount, loginUser } = require("../controllers/authController");

require("dotenv").config();

const router = express.Router();

router.route("/users").post(createAccount);
router.route("/users/login").post(loginUser);

module.exports = router;
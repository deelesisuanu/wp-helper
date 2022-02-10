const express = require("express");

const { createAccount } = require("../controllers/authController");

require("dotenv").config();

const router = express.Router();

router.route("/users").post(createAccount);

module.exports = router;
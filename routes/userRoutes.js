const express = require("express");

const {
    getUserByUsername, getUserByCustomerId, updateBilling,
    updateShipping, updateGeneral, updateGeneralAddress, updateGeneralAddressV2
} = require("../controllers/userController");

const {
    getBalance, creditDebitWallet
} = require("../controllers/miscController");

require("dotenv").config();

const router = express.Router();

router.route("/users/search/username/:username").get(getUserByUsername);
router.route("/users/customer/:customer_id").get(getUserByCustomerId)
    .post(updateGeneralAddressV2);

router.route("/users/get/user/balance/:customer_id").get(getBalance);
router.route("/users/wallet/:customer_id").post(creditDebitWallet);

router.route("/users/customer/billing/:customer_id").put(updateBilling);
router.route("/users/customer/shipping/:customer_id").put(updateShipping);
router.route("/users/customer/info/:customer_id").put(updateGeneral);

module.exports = router;
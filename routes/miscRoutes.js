const express = require("express");

const {
    continents, countries, currencies, paymentMethods, shippingMethods
} = require("../controllers/miscController");

require("dotenv").config();

const router = express.Router();

router.route("/data/continents").get(continents);
router.route("/data/countries").get(countries);
router.route("/data/currencies").get(currencies);
router.route("/data/payment/methods").get(paymentMethods);
router.route("/data/shipping/methods").get(shippingMethods);

module.exports = router;
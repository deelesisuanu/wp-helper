const express = require("express");

// const { createAccount } = require("../controllers/authController");

const { 
    doSomethingDiff,
    listProducts, listProduct,
    getProductVariation, getProductVariations,
    getProductCategories
 } = require("../controllers/mainPressController");

require("dotenv").config();

const router = express.Router();

router.route("/calls").post(doSomethingDiff);

router.route("/products").get(listProducts);
router.route("/products/:product_id").get(listProduct);

router.route("/products/:product_id/variants").get(getProductVariations);
router.route("/products/:product_id/variants/:variant_id").get(getProductVariation);

router.route("/products/categories").get(getProductCategories);

module.exports = router;
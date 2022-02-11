const express = require("express");

// const { createAccount } = require("../controllers/authController");

const { 
    listProducts, listProduct,
    getProductVariation, getProductVariations,
    getProductCategories, getCategories
 } = require("../controllers/mainPressController");

require("dotenv").config();

const router = express.Router();

router.route("/products").get(listProducts);
router.route("/products/:product_id").get(listProduct);

router.route("/products/:product_id/variants").get(getProductVariations);
router.route("/products/:product_id/variants/:variant_id").get(getProductVariation);

router.route("/products/main/categories").get(getCategories);
router.route("/products/main/categories/:category_id").get(getProductCategories);

module.exports = router;
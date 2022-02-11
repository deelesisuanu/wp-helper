const express = require("express");

const {
    createOrder, updateOrderPaid, orderById, myOrdersAll
} = require("../controllers/orderController");

require("dotenv").config();

const router = express.Router();

router.route("/users/orders/:customer_id").post(createOrder).get(myOrdersAll);
router.route("/users/orders/:order_id").put(updateOrderPaid).get(orderById);

module.exports = router;
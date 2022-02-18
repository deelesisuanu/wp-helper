const express = require("express");

const {
    createOrder, updateOrderPaid, orderById, myOrdersAll
} = require("../controllers/orderController");

require("dotenv").config();

const router = express.Router();

router.route("/users/orders/:customer_id").post(createOrder).get(myOrdersAll);
router.route("/users/orders/:order_id").put(updateOrderPaid);
router.route("/users/orders/i/:order_id").get(orderById); 

module.exports = router;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");

const fetch = require('node-fetch');

const {
    buildUserInfoResource, buildUserCustomerResource
} = require("../utils/functions");

const { api, perPage } = require("../utils/woo-commerce");

const createOrder = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        payment_method_id: Joi.string().required(),
        payment_method: Joi.string().required(),
        items: Joi.array().required(),
        shipping_methods: Joi.array().required(),
        hasPaid: Joi.boolean().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { customer_id } = req.params;
    const { payment_method_id, payment_method, items, shipping_methods, hasPaid } = req.body;

    api.get(`customers/${customer_id}`, { per_page: perPage }).then((response) => {

        const { billing, shipping } = buildUserCustomerResource(response.data);

        const data = {
            payment_method: payment_method_id,
            payment_method_title: payment_method,
            set_paid: hasPaid,
            customer_id: customer_id,
            billing: billing,
            shipping: shipping,
            line_items: items,
            shipping_lines: shipping_methods
        };

        api.post(`orders`, data).then((response) => {

            const order = response.data;
            delete order["_links"];

            res.status(StatusCodes.OK).json({
                status: "success",
                data: order,
            });

        }).catch((error) => {
            console.log(error);
            return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
        });

    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

const updateOrderPaid = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        order_id: Joi.string().required(),
    });

    const { error } = schema.validate(req.params);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { order_id } = req.params;

    const data = {
        set_paid: true
    };

    api.put(`orders/${order_id}`, data).then((response) => {

        res.status(StatusCodes.OK).json({
            status: "success",
            message: "Order Completed Successfully"
        });

    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

const orderById = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        order_id: Joi.string().required(),
    });

    const { error } = schema.validate(req.params);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { order_id } = req.params;

    api.get(`orders/${order_id}`).then((response) => {

        const order = response.data;
        delete order["_links"];

        res.status(StatusCodes.OK).json({
            status: "success",
            data: order,
        });

    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

const myOrdersAll = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        customer_id: Joi.string().required(),
    });

    const { error } = schema.validate(req.params);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { customer_id } = req.params;

    api.get(`orders`).then((response) => {

        const order = response.data;

        const orders = order.filter((or) => {
            if (or.customer_id == customer_id) {
                delete or["_links"];
                return or;
            }
        });

        res.status(StatusCodes.OK).json({
            status: "success",
            data: orders,
        });

    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

module.exports = {
    createOrder,
    updateOrderPaid,
    orderById,
    myOrdersAll
}
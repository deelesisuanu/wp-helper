const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");

const fetch = require('node-fetch');

const { api, baseUrl, accessPassword, accessUsername } = require("../utils/woo-commerce");

const {
    buildCountriesCollection, buildPaymentsCollection,
    buildShippingCollection, buildCurrencyCollection,
    buildContinentCollection
} = require("../utils/resources");

const paymentMethods = catchAsync(async (req, res, next) => {
    api.get(`payment_gateways`).then((response) => {
        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildPaymentsCollection(response.data),
        });
    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });
});

const shippingMethods = catchAsync(async (req, res, next) => {
    api.get(`shipping_methods`).then((response) => {
        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildShippingCollection(response.data),
        });
    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });
});

const countries = catchAsync(async (req, res, next) => {
    api.get(`data/countries`).then((response) => {
        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildCountriesCollection(response.data),
        });
    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });
});

const continents = catchAsync(async (req, res, next) => {
    api.get(`data/continents`).then((response) => {
        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildContinentCollection(response.data),
        });
    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });
});

const currencies = catchAsync(async (req, res, next) => {
    api.get(`data/currencies`).then((response) => {
        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildCurrencyCollection(response.data),
        });
    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });
});

const getBalance = catchAsync(async (req, res, next) => {
    const schema = Joi.object().keys({
        customer_id: Joi.string().required(),
    });

    const { error } = schema.validate(req.params);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));
    
    const { customer_id } = req.params;
    const api = `${baseUrl}wp-json/wc/v2/wallet/balance/${customer_id}`;

    fetch(`${api}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(accessUsername + ":" + accessPassword).toString('base64')
        },
    })
        .then((data) => {
            return data.text();
        }).then((val) => {

            res.status(StatusCodes.OK).json({
                status: "success",
                message: "Balance retrieved successfully",
                balance: val
            });

        }).catch((err) => {
            return next(new AppError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR));
        });
});

const creditDebitWallet = catchAsync(async (req, res, next) => {
    const schema = Joi.object().keys({
        amount: Joi.number().required(),
        wallet_trans: Joi.string().valid('debit', 'credit').required(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));
    
    const { wallet_trans, amount } = req.body;
    const { customer_id } = req.params;

    const api = `${baseUrl}wp-json/wc/v2/wallet/${customer_id}`;

    const data = {
        type: wallet_trans,
        amount: amount
    }

    fetch(`${api}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(accessUsername + ":" + accessPassword).toString('base64')
        },
    })
        .then((data) => {
            return data.text();
        }).then((val) => {

            var response = val.charAt(0);

            if (response != '2') {
                return next(new AppError(`cannot update balance, please try again`, StatusCodes.BAD_REQUEST));
            }
            else {
                res.status(StatusCodes.OK).json({
                    status: "success",
                    message: "Balance updated successfully"
                });
            }

        }).catch((err) => {
            return next(new AppError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR));
        });
});

module.exports = {
    paymentMethods,
    shippingMethods,
    countries,
    continents,
    currencies,
    getBalance,
    creditDebitWallet
}
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const { StatusCodes } = require("http-status-codes");

const { api } = require("../utils/woo-commerce");

const { 
    buildCountriesCollection, buildPaymentsCollection, 
    buildShippingCollection, buildCurrencyCollection,
    buildContinentCollection
} = require("../utils/functions");

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

module.exports = {
    paymentMethods,
    shippingMethods,
    countries,
    continents,
    currencies
}
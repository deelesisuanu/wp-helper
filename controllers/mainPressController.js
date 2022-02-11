const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");

const fs = require("fs");

const { 
    buildProductCollection, buildProductResources,
    buildProductVariantCollection, buildProductVariantResources
 } = require("../utils/functions");

const { api, perPage } = require("../utils/woo-commerce");

const doSomethingDiff = catchAsync(async (req, res, next) => {

    console.log("Starting out");
    console.log(req.body);

});

const listProducts = catchAsync(async (req, res, next) => {

    api.get("products", { per_page: perPage }).then((response) => {

        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildProductCollection(response.data)
        });

    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });
});

const listProduct = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        product_id: Joi.number().required(),
    });

    const { error } = schema.validate(req.params);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { product_id } = req.params;

    api.get(`products/${product_id}`, { per_page: perPage }).then((response) => {

        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildProductResources(response.data)
        });

    }).catch((error) => {
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

const getProductVariations = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        product_id: Joi.number().required(),
    });

    const { error } = schema.validate(req.params);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { product_id } = req.params;

    api.get(`products/${product_id}/variations`, { per_page: perPage }).then((response) => {

        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildProductVariantCollection(response.data)
        });

    }).catch((error) => {
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

const getProductVariation = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        product_id: Joi.number().required(),
        variant_id: Joi.number().required()
    });

    const { error } = schema.validate(req.params);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { product_id, variant_id } = req.params;

    api.get(`products/${product_id}/variations/${variant_id}`, { per_page: perPage }).then((response) => {

        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildProductVariantResources(response.data)
        });

    }).catch((error) => {
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

const getProductCategories = catchAsync(async (req, res, next) => {

    api.get(`products/categories`, { per_page: perPage }).then((response) => {

        res.status(StatusCodes.OK).json({
            status: "success",
            data: response.data
        });

    }).catch((error) => {
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

module.exports = {
    listProducts,
    listProduct,
    getProductVariations,
    getProductVariation,
    getProductCategories,
    doSomethingDiff
};
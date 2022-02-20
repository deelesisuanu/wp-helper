const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");

const fetch = require('node-fetch');

const {
    buildUserInfoResource, buildUserCustomerResource
} = require("../utils/resources");

const { api, perPage, accessPassword, accessUsername, baseUrl } = require("../utils/woo-commerce");

const baseUrlPresent = `${baseUrl}wp-json/wp/v2/`;

const getUserByUsername = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        username: Joi.string().required(),
    });

    const { error } = schema.validate(req.params);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { username } = req.params;

    fetch(`${baseUrlPresent}users/?search=${username}`, {
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

            const mainData = JSON.parse(val);

            const { data, message } = mainData[0];

            if (message != undefined) {
                return next(new AppError(`${message}`, StatusCodes.BAD_REQUEST));
            }
            else {
                res.status(StatusCodes.OK).json({
                    status: "success",
                    data: buildUserInfoResource(mainData[0])
                });
            }

        }).catch((err) => {
            return next(new AppError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR));
        });

});

const getUserByCustomerId = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        customer_id: Joi.string().required(),
    });

    const { error } = schema.validate(req.params);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { customer_id } = req.params;

    api.get(`customers/${customer_id}`, { per_page: perPage }).then((response) => {

        res.status(StatusCodes.OK).json({
            status: "success",
            // data: buildProductCollection(response.data),
            data: buildUserCustomerResource(response.data),
        });

    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

const updateBilling = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        company: Joi.string(),
        address_1: Joi.string().required(),
        address_2: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        postcode: Joi.string(),
        country: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.string(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { first_name, last_name, company, address_1, address_2, city, state, postcode, email, country, phone } = req.body;

    const { customer_id } = req.params;

    const data = {
        billing: {
            first_name: first_name,
            last_name: last_name,
            company: company,
            address_1: address_1,
            address_2: address_2,
            city: city,
            state: state,
            postcode: postcode,
            country: country,
            email: email,
            phone: phone
        }
    };

    api.put(`customers/${customer_id}`, data).then((response) => {

        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildUserCustomerResource(response.data),
        });

    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

const updateShipping = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        company: Joi.string(),
        address_1: Joi.string().required(),
        address_2: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        postcode: Joi.string(),
        country: Joi.string(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { first_name, last_name, company, address_1, address_2, city, state, postcode, country } = req.body;

    const { customer_id } = req.params;

    const data = {
        shipping: {
            first_name: first_name,
            last_name: last_name,
            company: company,
            address_1: address_1,
            address_2: address_2,
            city: city,
            state: state,
            postcode: postcode,
            country: country,
        }
    };

    api.put(`customers/${customer_id}`, data).then((response) => {

        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildUserCustomerResource(response.data),
        });

    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

const updateGeneral = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { first_name, last_name } = req.body;

    const { customer_id } = req.params;

    const data = {
        first_name: first_name,
        last_name: last_name,
    };

    api.put(`customers/${customer_id}`, data).then((response) => {

        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildUserCustomerResource(response.data),
        });

    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

const updateGeneralAddress = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        shipping: Joi.object().required(),
        billing: Joi.object().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { shipping, billing } = req.body;

    const { customer_id } = req.params;

    const data = {
        billing: {
            first_name: billing.first_name,
            last_name: billing.last_name,
            company: billing.company,
            address_1: billing.address_1,
            address_2: billing.address_2,
            city: billing.city,
            state: billing.state,
            postcode: billing.postcode,
            country: billing.country,
            email: billing.email,
            phone: billing.phone
        },
        shipping: {
            first_name: shipping.first_name,
            last_name: shipping.last_name,
            company: shipping.company,
            address_1: shipping.address_1,
            address_2: shipping.address_2,
            city: shipping.city,
            state: shipping.state,
            postcode: shipping.postcode,
            country: shipping.country,
        }
    };

    api.put(`customers/${customer_id}`, data).then((response) => {

        res.status(StatusCodes.OK).json({
            status: "success",
            data: buildUserCustomerResource(response.data),
        });

    }).catch((error) => {
        console.log(error);
        return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
    });

});

module.exports = {
    getUserByUsername,
    getUserByCustomerId,
    updateBilling,
    updateShipping,
    updateGeneral,
    updateGeneralAddress
}
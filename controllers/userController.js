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

const updateGeneralAddressV2 = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        first_name_billing: Joi.string().required(),
        last_name_billing: Joi.string().required(),
        company_billing: Joi.string(),
        address_1_billing: Joi.string().required(),
        address_2_billing: Joi.string(),
        city_billing: Joi.string(),
        state_billing: Joi.string(),
        postcode_billing: Joi.string(),
        country_billing: Joi.string(),
        email_billing: Joi.string().email(),
        phone_billing: Joi.string(),
        first_name_shipping: Joi.string().required(),
        last_name_shipping: Joi.string().required(),
        company_shipping: Joi.string(),
        address_1_shipping: Joi.string().required(),
        address_2_shipping: Joi.string(),
        city_shipping: Joi.string(),
        state_shipping: Joi.string(),
        postcode_shipping: Joi.string(),
        country_shipping: Joi.string(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { first_name_billing, last_name_billing, company_billing, 
        address_1_billing, address_2_billing, city_billing, state_billing, 
        postcode_billing, country_billing, email_billing, phone_billing, 
        first_name_shipping, last_name_shipping, company_shipping, 
        address_1_shipping, address_2_shipping, city_shipping, state_shipping, 
        postcode_shipping, country_shipping } = req.body;

    const { customer_id } = req.params;

    const data = {
        billing: {
            first_name: first_name_billing,
            last_name: last_name_billing,
            company: company_billing,
            address_1: address_1_billing,
            address_2: address_2_billing,
            city: city_billing,
            state: state_billing,
            postcode: postcode_billing,
            country: country_billing,
            email: email_billing,
            phone: phone_billing
        },
        shipping: {
            first_name: first_name_shipping,
            last_name: last_name_shipping,
            company: company_shipping,
            address_1: address_1_shipping,
            address_2: address_2_shipping,
            city: city_shipping,
            state: state_shipping,
            postcode: postcode_shipping,
            country: country_shipping,
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
    updateGeneralAddress,
    updateGeneralAddressV2
}
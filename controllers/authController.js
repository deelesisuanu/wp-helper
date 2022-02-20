const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const fetch = require('node-fetch');

const { buildUserResource, buildUserInfoResource } = require("../utils/resources");

const { accessPassword, accessUsername, baseUrl } = require("../utils/woo-commerce");

const loginUrl = `${baseUrl}?rest_route=/simple-jwt-login/v1/auth`;

const baseUrlPresent = `${baseUrl}wp-json/wp/v2/`;

const createAccount = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { username, email, password, first_name, last_name } = req.body;

    const data = {
        username: username,
        email: email,
        password: password,
        first_name: first_name,
        last_name: last_name
    }

    fetch(`${baseUrlPresent}users`, {
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

            const mainData = JSON.parse(val);

            const { data, message } = mainData;

            if (message != undefined) {
                return next(new AppError(`${message}`, StatusCodes.BAD_REQUEST));
            }
            else {
                res.status(StatusCodes.CREATED).json({
                    status: "success",
                    data: buildUserResource(mainData)
                });
            }

        }).catch((err) => {
            return next(new AppError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR));
        });

});

const loginUser = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { username, password } = req.body;

    const data = {
        username: username,
        password: password,
    }

    fetch(`${loginUrl}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
        },
    })
        .then((data) => {
            return data.text();
        }).then((val) => {

            const external_mainData = JSON.parse(val);

            const { jwt, message } = external_mainData.data;

            if (jwt == undefined) {
                return next(new AppError(`${message}`, StatusCodes.BAD_REQUEST));
            }
            else {

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
                                data: {
                                    user: buildUserInfoResource(mainData[0]),
                                    jwt: jwt
                                }
                            });
                        }

                    }).catch((err) => {
                        return next(new AppError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR));
                    });

            }

        }).catch((err) => {
            return next(new AppError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR));
        });

});

const refreshToken = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        token: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { token } = req.body;

    fetch(`${loginUrl}/refresh`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then((data) => {
            return data.text();
        }).then((val) => {

            const external_mainData = JSON.parse(val);

            const { jwt, message } = external_mainData.data;

            if (jwt == undefined) {
                return next(new AppError(`${message}`, StatusCodes.BAD_REQUEST));
            }
            else {

                res.status(StatusCodes.OK).json({
                    status: "success",
                    data: {
                        jwt: jwt
                    }
                });
            }

        }).catch((err) => {
            return next(new AppError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR));
        });
});

const resetPasswordRequest = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        email: Joi.string().required(),
    });

    const { error } = schema.validate(req.params);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { email } = req.params;

    const data = {
        email: email
    }

    fetch(`${baseUrl}/wp-json/bdpwr/v1/reset-password`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
    })
        .then((data) => {
            return data.text();
        }).then((val) => {

            if (val.includes(email)) {
                res.status(StatusCodes.OK).json({
                    status: "success",
                    message: "Reset code sent successfully to your email address"
                });
            }
            else {
                const external_mainData = JSON.parse(val);
                const { message } = external_mainData;

                if (!message || message != "") {
                    return next(new AppError(`${message}`, StatusCodes.BAD_REQUEST));
                }
            }

        }).catch((err) => {
            return next(new AppError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR));
        });
});

const validateResetCode = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        email: Joi.string().required(),
        code: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { email, code } = req.body;

    const data = {
        email: email,
        code: code
    }

    fetch(`${baseUrl}/wp-json/bdpwr/v1/validate-code`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
    })
        .then((data) => {
            return data.text();
        }).then((val) => {

            const external_mainData = JSON.parse(val);
            const { code, message } = external_mainData;

            if (code) {
                return next(new AppError(`${message}`, StatusCodes.BAD_REQUEST));
            }
            else {
                res.status(StatusCodes.OK).json({
                    status: "success",
                    message: message
                });
            }

        }).catch((err) => {
            return next(new AppError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR));
        });
});

const resetUserPassword = catchAsync(async (req, res, next) => {

    const schema = Joi.object().keys({
        email: Joi.string().required(),
        code: Joi.string().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    const { email, code, password } = req.body;

    const data = {
        email: email,
        code: code,
        password: password
    }

    fetch(`${baseUrl}/wp-json/bdpwr/v1/set-password`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
    })
        .then((data) => {
            return data.text();
        }).then((val) => {

            const external_mainData = JSON.parse(val);
            const { code, message } = external_mainData;

            if (code) {
                return next(new AppError(`${message}`, StatusCodes.BAD_REQUEST));
            }
            else {
                res.status(StatusCodes.OK).json({
                    status: "success",
                    message: message
                });
            }

        }).catch((err) => {
            return next(new AppError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR));
        });
});

module.exports = {
    createAccount,
    loginUser,
    refreshToken,
    resetPasswordRequest,
    validateResetCode,
    resetUserPassword
};
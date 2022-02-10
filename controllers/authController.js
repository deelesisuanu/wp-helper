const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

var fetch = require('node-fetch');

const { buildUserResource } = require("../utils/functions");


const accessUsername = process.env.ACCESS_USERNAME;
const accessPassword = process.env.ACCESS_PASSWORD;

let baseUrl = process.env.BASE_URL;

const loginUrl = `${baseUrl}wp-json/jwt-auth/v1/token`;

baseUrl = `${baseUrl}wp-json/wp/v2/`;

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

    fetch(`${baseUrl}users`, {
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

            if(!data || data != null || data == undefined) {
                res.status(StatusCodes.CREATED).json({
                    status: "success",
                    data: buildUserResource(mainData)
                });
            }
            else {
                return next(new AppError(`${message}`, StatusCodes.BAD_REQUEST));
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

            const mainData = JSON.parse(val);

            const { data, message } = mainData;

            if(!data || data != null || data == undefined) {
                res.status(StatusCodes.OK).json({
                    status: "success",
                    data: mainData
                });
            }
            else {
                return next(new AppError(`${message}`, StatusCodes.BAD_REQUEST));
            }

        }).catch((err) => {
            return next(new AppError(`${err}`, StatusCodes.INTERNAL_SERVER_ERROR));
        });

});

module.exports = {
    createAccount,
    loginUser
};
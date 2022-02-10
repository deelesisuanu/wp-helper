const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
var fetch = require('node-fetch');

const accessUsername = process.env.ACCESS_USERNAME;
const accessPassword = process.env.ACCESS_PASSWORD;

let baseUrl = process.env.BASE_URL;
baseUrl = `${baseUrl}wp-json/wp/v2/`;

const createAccount = catchAsync(async (req, res, next) => {

    console.log(req.body);

    // const schema = Joi.object().keys({
    //     username: Joi.string().required(),
    //     email: Joi.string().email().required(),
    //     password: Joi.string().required(),
    //     first_name: Joi.string().required(),
    //     last_name: Joi.string().required(),
    // });

    // const { error } = schema.validate(req.body);

    // if (error) return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));

    // const { username, email, password, first_name, last_name } = req.body;

    // const data = {
    //     username: username,
    //     email: email,
    //     password: password,
    //     first_name: first_name,
    //     last_name: last_name
    // }

    // console.log(baseUrl);

    // fetch(`${baseUrl}users`, {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers: {
    //         'Authorization': 'Basic ' + Buffer.from(accessUsername + ":" + accessPassword).toString('base64')
    //     },
    // })
    //     .then((data) => {
    //         return data.text();
    //     }).then((val) => {

    //         console.log(val);

    //     }).catch((err) => {
    //         console.log(err);
    //     });

});

module.exports = {
    createAccount,
};
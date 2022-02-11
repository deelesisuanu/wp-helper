const WooCommerceRestApi = require("@reformosoftware/woocommerce-rest-api").default;

const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const baseUrl = process.env.BASE_URL;

const bearerAccess = process.env.BASIC_BEARER;

const perPage = process.env.PER_PAGE;

const accessUsername = process.env.ACCESS_USERNAME;
const accessPassword = process.env.ACCESS_PASSWORD;

const api = new WooCommerceRestApi({
    url: baseUrl,
    consumerKey: consumerKey,
    consumerSecret: consumerSecret,
    version: "wc/v3",
});

module.exports = { api, perPage, bearerAccess, accessUsername, accessPassword, baseUrl };
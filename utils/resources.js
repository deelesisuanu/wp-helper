const { HEX_COLORS } = require("./functions");


const buildProductResources = (product) => {
    const {
        id, name, slug, permalink, date_created,
        date_modified, status, description,
        short_description, sku, price, regular_price, sale_price, categories,
        images, price_html, stock_status, store
    } = product;
    return {
        "product_id": id, "product_name": name, "product_slug": slug, permalink, date_created,
        date_modified, status, description,
        short_description, sku, price, regular_price, sale_price, categories,
        "product_images": images, price_html, stock_status/* , "product_owner": store */
    };
};

const buildProductVariantResources = (product_variant) => {
    const {
        id, permalink, date_created,
        date_modified, status, sku, price, regular_price, sale_price,
        image, stock_status
    } = product_variant;
    return {
        "variant_id": id, permalink, date_created,
        date_modified, status, sku, price, regular_price, sale_price,
        "variant_images": image, stock_status
    };
};

const buildProductVariantCollection = (variants) => {
    const variantsArray = [];
    variants.map((vr) => {
        const resourcedProductVariant = buildProductCollection(vr);
        variantsArray.push(resourcedProductVariant);
    });
    return variantsArray;
};

const buildProductCollection = (products) => {
    const productArray = [];
    products.map((pr) => {
        const resourcedProduct = buildProductResources(pr);
        productArray.push(resourcedProduct);
    });
    return productArray;
};

const buildUserResource = (user) => {
    const {
        id, username, name, first_name, last_name,
        email, nickname, registered_date, roles,
    } = user;

    return {
        id, username, name, first_name, last_name,
        email, nickname, registered_date, roles,
    };
};

const buildUserInfoResource = (user) => {
    const {
        id, slug, name, link
    } = user;

    return {
        id, slug, name, link,
    };
};

const buildUserCustomerResource = (user) => {
    const {
        id, username, first_name, last_name,
        email, date_created, role, billing, shipping,
        avatar_url
    } = user;
    return {
        id, username, first_name, last_name,
        email, registered_date: date_created, role,
        billing, shipping, avatar_url
    };
};

const buildCountryResource = (country) => {
    const {
        code, name, states
    } = country;
    return {
        code, name, states
    };
};

const buildCountriesCollection = (countries) => {
    const countryArray = [];
    countries.map((cr) => {
        const resourcedCountry = buildCountryResource(cr);
        countryArray.push(resourcedCountry);
    });
    return countryArray;
};

const buildPaymentResource = (method) => {
    const {
        id, title, description, enabled, order, method_title,
        method_description, method_supports
    } = method;
    return {
        id, title, description, enabled, order, method_title,
        method_description, method_supports
    };
};

const buildPaymentsCollection = (methods) => {
    const methodsArray = [];
    methods.map((cr) => {
        const method = buildPaymentResource(cr);
        methodsArray.push(method);
    });
    return methodsArray;
};

const buildShippingResource = (ship) => {
    const {
        id, title, description
    } = ship;
    return {
        id, title, description
    };
};

const buildShippingCollection = (ships) => {
    const shipsArray = [];
    ships.map((cr) => {
        const method = buildShippingResource(cr);
        shipsArray.push(method);
    });
    return shipsArray;
};

const buildCurrencyResource = (cur) => {
    const {
        code, name, symbol
    } = cur;
    return {
        code, name, symbol
    };
};

const buildCurrencyCollection = (currencies) => {
    const currencyArray = [];
    currencies.map((cr) => {
        const method = buildCurrencyResource(cr);
        currencyArray.push(method);
    });
    return currencyArray;
};

const buildContinentResource = (con) => {
    const {
        code, name, countries
    } = con;
    return {
        code, name, countries
    };
};

const buildContinentCollection = (continents) => {
    const continentArray = [];
    continents.map((cr) => {
        const method = buildContinentResource(cr);
        continentArray.push(method);
    });
    return continentArray;
};

const buildCategoryResource = (con) => {
    const { id, name, slug, parent, description, display, image, menu_order, count, color_code } = con;
    return {
        id, name, slug, parent, description, display, image, menu_order, count, color_code 
    };
};

const buildCategoriesCollection = (categories) => {
    const categoriesArray = [];
    categories.map((cr) => {
        const RANDOM_COLOR_INDEX = Math.floor(Math.random() * HEX_COLORS.length);
        cr.color_code = HEX_COLORS[RANDOM_COLOR_INDEX];
        const method = buildCategoryResource(cr);
        categoriesArray.push(method);
    });
    return categoriesArray;
};

module.exports = {
    buildProductCollection,
    buildProductResources,
    buildProductVariantCollection,
    buildProductVariantResources,
    buildUserResource,
    buildUserInfoResource,
    buildUserCustomerResource,
    buildCountriesCollection,
    buildCountryResource,
    buildPaymentsCollection,
    buildPaymentResource,
    buildShippingCollection,
    buildShippingResource,
    buildCurrencyCollection,
    buildCurrencyResource,
    buildContinentCollection,
    buildContinentResource,
    buildCategoryResource,
    buildCategoriesCollection
};
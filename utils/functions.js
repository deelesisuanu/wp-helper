
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
        "product_images": images, price_html, stock_status, "product_owner": store
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

module.exports = {
    buildProductCollection,
    buildProductResources,
    buildProductVariantCollection,
    buildProductVariantResources,
    buildUserResource
};
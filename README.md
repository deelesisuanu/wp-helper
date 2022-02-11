# Helper Node WordPress

Helper Node API Wrapper For WordPress. Clone and use for your project

## Plugins Needed in Wordpress

  * [Custom API for WP](https://wordpress.org/plugins/custom-api-for-wp/)
  * [JSON API](https://wordpress.org/plugins/json-api/)
  * [JSON API Auth](https://wordpress.org/plugins/json-api-auth/)
  * [JSON Basic Authentication](https://github.com/WP-API/Basic-Auth)
  * [Simple-JWT-Login - For Loggin in](https://wordpress.org/plugins/simple-jwt-login/)
  * [WP REST Cache](https://wordpress.org/plugins/wp-rest-cache/)

### Examples

Start the Service 

```sh
$ npm run dev
```

## Development

  1. Clone this repo
  2. Create .env file with these values from your wp account ( `CONSUMER_KEY`, `CONSUMER_SECRET`, `PER_PAGE`, `BASE_URL`, `ACCESS_USERNAME`, `ACCESS_PASSWORD` )
  3. Run `npm install`
  4. Run `npm run dev`
  5. Dev server is now running on port 5100, you can always change this

### Configuration

Parameters that must be configured in a `.env` file:

  * `CONSUMER_KEY` - Create your Consumer Key from woocommerce API
  * `CONSUMER_SECRET` - Create your Consumer Secret from woocommerce API
  * `PER_PAGE` - Set number of data to be retrieved at once default: `10`
  * `BASE_URL` - Your website url, example: `http://example.com/`
  * `ACCESS_USERNAME` - A wordpress admin username
  * `ACCESS_PASSWORD` - A wordpress admin password

## Deployment

You can deploy to any service of your choice.

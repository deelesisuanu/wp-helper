# Helper Node WordPress

Helper Node API Wrapper For WordPress. Clone and use for your project

## Plugins Needed in Wordpress

  * [Custom API for WP](#getting-started)
  * [JSON API](#upgrading)
  * [JSON API Auth](#api-documentation)
  * [JSON Basic Authentication](#rpc)
  * [Simple-JWT-Login - For Loggin in](#installation)
  * [WP REST Cache](#troubleshooting)

### Examples

To start the Wallet API service on port 3000:

```sh
$ blockchain-wallet-service start --port 3000
```

## Development

  1. Clone this repo
  2. Run `yarn --ignore-engines`
  3. Run `yarn start`
  4. Dev server is now running on port 3000

If you are developing `blockchain-wallet-client` alongside this module, it is useful to create a symlink to `my-wallet-v3`:

```sh
$ ln -s ../path/to/my-wallet-v3 node_modules/blockchain-wallet-client
```

### Testing

```sh
$ yarn test
```

### Configuration

Optional parameters can be configured in a `.env` file:

  * `PORT` - port number for running dev server (default: `3000`)
  * `BIND` - ip address to bind the service to (default: `127.0.0.1`)

## Deployment

If you want to use blockchain-wallet-service in your UNIX production server, you just have to run:

```sh
$ nohup blockchain-wallet-service start --port 3000 &
```

# declick

[![pipeline status](https://gitlab.com/colombbus/declick/badges/dev/pipeline.svg)](https://gitlab.com/colombbus/declick/-/commits/dev)

## usage

[Declick platform](https://gitlab.com/colombbus/declick) is a software aims to learn programming.

It is built on [Vue.js](https://vuejs.org) for the client part / [laravel](https://laravel.org) for the server part

## Installation

1. Install [node.js](https://nodejs.org/)
2. Run `npm install -g yarn` to install `yarn`
2. Run `yarn` in `runtime/` & `objects/` & `client/` to install dependencies
3. Run `composer install` in `server`

## Configuration

1. copy src/assets/config/declick.example.js into src/assets/config/declick.js and set parameters according to your configuration:
    * domain: you can specify a domain in order to be able to load content from a cms located on another domain (CSRF protection)
    * basePath: base path following your server address. For instance if access url is 'http://localhost/declick-ui/dist', basePath should be set to '/declick-client/dist'
    * apiUrl: URL to server endpoint, e.g. 'http://localhost/declick-server/api/',
    * clientUrl: URL to declick-client, e.g. 'http://localhost/declick-client/dist/',
    * cmsUrl: URL to CMS storing static pages, e.g. 'http://localhost/cms/'

3. copy src/assets/config/social-services-example.js into src/assets/config/social-service.js. If you want to use social services (FB, Google), you have to set the corresponding ids.

4. At the application root copy htaccess.example into .htaccess and set parameter RewriteBase according to your configuration. For instance if access url is 'http://localhost/declick-ui/dist', RewriteBase should be '/declick-ui/dist/'

## Development
To test development version, you may serve files with hot reload at localhost:8080

1. Run `yarn serve` in `runtime/`
2. Run `yarn serve` in `objects/`
3. Run `yarn serve` in  `client/`

# Build
To build for production with minifaction, user the following command:

1. Run `yarn build` in `runtime/`
2. Run `yarn build` in `objects/`
3. Run `yarn build` in  `client/`

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

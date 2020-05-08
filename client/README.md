# Declick User Interface

This component is part of [Declick platform](https://gitlab.com/colombbus/declick).

It is built on [Vue.js](https://vuejs.org).

## Installation

1. Install [node.js](https://nodejs.org/)
2. Run `npm install -g yarn` to install `yarn`
3. Run `yarn` to install dependencies

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
To test development version, you may serve files with hot reload at localhost:8080, run `yarn serve`

# Build
To build in `dist/` default folder, run `yarn build`

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# Credits
- [VBlockly](https://github.com/abbychau/v-blockly)
- [vue-spinner](https://github.com/greyby/vue-spinner)

# TODO
- translate
- remove sass
- bootstrap
- translate og
- html lang local
- MDR: learn/setResults without user 

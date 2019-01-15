# Declick User Interface

This component is part of [Declick v2 platform](https://github.com/colombbus/declick-v2).

It is built on [Vue.js](https://vuejs.org).

## Installation

1. Install [node.js](https://nodejs.org/)
2. Install [bower](https://bower.io) `npm install -g bower`
3. Run `npm install`
4. Run `bower install`

## Configuration

1. copy config/index.example.js into config/index.js and set the following parameters:
    * assetsPublicPath: the path to your application (e.g. http://[server-address]/declick-ui/dist)
    * assetsSubdirectory: the subpath where assets are stored, usually 'static' (unless you change build parameters)

2. copy src/assets/config/declick.example.js into src/assets/config/declick.js and set parameters according to your configuration:
    * domain: you can specify a domain in order to be able to load content from a cms located on another domain (CSRF protection)
    * basePath: base path following your server address. For instance if access url is 'http://localhost/declick-ui/dist', basePath should be set to '/declick-ui/dist'
    * apiUrl: URL to server endpoint, e.g. 'http://localhost/declick-server-v2/api/',
    * clientUrl: URL to declick-client, e.g. 'http://localhost/declick-client/dist/',
    * cmsUrl: URL to CMS storing static pages, e.g. 'http://localhost/cms/'

3. copy src/assets/config/social-services-example.js into src/assets/config/social-service.js. If you want to use social services (FB, Google), you have to set the corresponding ids.

4. At the application root copy htaccess.example into .htaccess and set parameter RewriteBase according to your configuration. For instance if access url is 'http://localhost/declick-ui/dist', RewriteBase should be '/declick-ui/dist/'

## Development
To test development version, you may serve files with hot reload at localhost:8080

```
npm run dev
```

# Build
To build for production with minifaction, user the following command:

```
npm run build
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

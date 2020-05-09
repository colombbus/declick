# Declick User Interface

This component is part of [Declick platform](https://gitlab.com/colombbus/declick).

It is built on [Vue.js](https://vuejs.org).
## Configuration

1. copy `src/assets/js/example.config.js` into `src/assets/js/config.js` and set parameters according to your configuration:
    * domain: you can specify a domain in order to be able to load content from a cms located on another domain (CSRF protection)
    * basePath: base path following your server address. For instance if access url is 'http://localhost/declick-ui/dist', basePath should be set to '/declick-client/dist'
    * apiUrl: URL to server endpoint, e.g. 'http://localhost/declick-server/api/',
    * clientUrl: URL to declick-client, e.g. 'http://localhost/declick-client/dist/',
    * cmsUrl: URL to CMS storing static pages, e.g. 'http://localhost/cms/'
2. At the application root copy htaccess.example into .htaccess and set parameter RewriteBase according to your configuration. For instance if access url is `http://localhost/declick-client/dist`, RewriteBase should be `/declick-client/dist/`

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```
To test development version, hot reload should be access in your browser in most case at `http://localhost:8080`

### Compiles and minifies for production
```
yarn build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your end-to-end tests
```
yarn run test:e2e
```

### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Credits
- [VBlockly](https://github.com/abbychau/v-blockly)
- [vue-spinner](https://github.com/greyby/vue-spinner)


# cubx-webpackage-document-api

[![npm][npm-image]][npm-url]

This lib is part of the Cubbles platform. I provides an api for a webpackage document, e.g. with a method for validation.

## Install

```sh
$ npm install cubx-webpackage-document-api
```

## API
```js
var WebpackageDocumentAPI = require('webpackage-document-api');
var webpackageApi = new WebpackageDocumentAPI(manifestWebpackage);
webpackageApi.setManifestWebapp(webappManifest)
webpackageApi.setManifestCubx(cubxManifest);
webpackageApi.setManifestComponent(webbleManifest);

var couchDocument = webpackageApi.getWebpackageDocument();
```

[npm-image]: https://img.shields.io/npm/v/cubx-webpackage-document-api.svg?style=flat
[npm-url]: https://npmjs.org/package/cubx-webpackage-document-api

![Logo of the project](./public/images/logo.png)

[![build status](https://travis-ci.org/globocom/globomap-ui.svg?branch=master)](http://travis-ci.org/globocom/globomap-ui)

# Globo Map UI

This is the UI part of the Globo Map project that consists of mapping any structure in the form of a graph.

## Installing / Getting started

To run the UI, first you need a Globo Map API endpoint running. See [Globo Map API](https://github.com/globocom/globomap-api).

```shell
# Set API environment variable
export GLOBOMAP_API_URL=<api_endpoint>/v1

# Install dependencies, build a deployable version, run
npm install
npm run build
node server
```

Now you have an up and running Globo Map UI app (http://localhost:8888)

## Developing

### Built With
- [React](https://github.com/facebook/react)
- [Socket.io](https://github.com/socketio/socket.io)
- [Express](https://github.com/expressjs/express)
- [Axios](https://github.com/axios/axios)

### Prerequisites
[Globo Map API](https://github.com/globocom/globomap-api)

### Setting up Dev

Globo Map UI was built with [Create React App](https://github.com/facebookincubator/create-react-app). 
To run the Dev environment:

```shell
git clone https://github.com/globocom/globomap-ui
cd globomap-ui
npm install

# You still need to set a environment variable with Globo Map API endpoint url:
export GLOBOMAP_API_URL=<api_endpoint>/v1

# Start server
node server

# On an other terminal, run the app in dev mode
npm start
```

### Building

When code changes, you need to run the build script:
```shell
npm run build
```

This will create an optmized version of the app with performance improvements.

## Licensing

Globo Map UI is under [Apache 2 License](./LICENSE)

const Route = require('anyproxy-router/Route');

const { maxString } = require('../helpers');

const BaseRoute = new Route(); // Math all

module.exports = (addRoute) => {
  addRoute(
    BaseRoute.extends(), {
      beforeSendRequest: (requestDetail) => {
        console.log(
          requestDetail.requestOptions.method,
          maxString(requestDetail.url, 150)
        );
      }
    }
  )
};

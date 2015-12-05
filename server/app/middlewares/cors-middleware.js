/*global require,module,console*/
(function() {
  'use strict';

  var CorsMiddleware = function(options) {
    this.options = require('extend')({}, options);
    this.app = options.app;
  };

  CorsMiddleware.prototype = {
    /**
     * Express Middleware to manage CrossDomain
     * @param {Object}   req  request
     * @param {Object}   res  resource
     * @param {function} next next treatment
     */
    middleware: function() {
      var app = this.app;
      var _self = this;
      var url = require('url');

      return function(req, res, next) {
        app.logger('CORS');
        var referer = req.headers.referer || req.headers.origin;
        if (referer) {
          var refererUrl = url.parse(referer);
          var allowedOrigin = refererUrl.protocol + '//' + req.hostname +
            ':' + refererUrl.port;
          app.logger('allowingCrossDomain on ' + allowedOrigin);
          res.header('Access-Control-Allow-Origin', allowedOrigin);
          res.header('Access-Control-Allow-Methods',
            'GET,PUT,POST,DELETE');
          res.header('Access-Control-Allow-Headers',
            'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Mindflash-SessionID, Tat_username, Tat_password'
          );

          // intercept OPTIONS method
          if ('OPTIONS' === req.method) {
            res.sendStatus(200);
          } else {
            next();
          }
        } else {
          next();
        }
      };
    }
  };

  module.exports = CorsMiddleware;
})();

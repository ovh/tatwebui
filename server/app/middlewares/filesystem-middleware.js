/*global require,module,console*/
(function() {
  'use strict';

  var FileSystemMiddleware = function(options) {
    this.options = require('extend')({
      basePath: '.',
      public: {
        folder: '.',
        default: 'index.html'
      }
    }, options);
    this.app = options.app;
    this.publicFolder = require('path').normalize(this.options.basePath +
      '/' + this.options.public.folder);
    this.HttpInfo = require('./../http-info.js');
  };

  FileSystemMiddleware.prototype = {

    /**
     * Express Middleware to serve files
     * @param {Object}   req  request
     * @param {Object}   res  resource
     * @param {function} next next treatment 
     */
    middleware: function() {
      var app = this.app;
      var _self = this;
      var fs = require('fs');
      return function(req, res, next) {
        var info = new _self.HttpInfo(req);
        switch (info.getHttpMethod()) {
          case 'GET':
            var requestedPath = info.getFullPath();
            var requestedUrl = ((req.url) && (req.url.length > 1) ? req
              .url : '/' + _self.options.public.default).replace(
              /\.\./g, '').replace(/\?.*/, '');
            var filename = _self.publicFolder + requestedUrl;
            // check if a specific file was requested
            app.logger('Check for file', req.url);
            if ((requestedUrl) && (fs.existsSync(filename))) {
              app.logger('Serving file ' + requestedUrl);
              res.sendfile(requestedUrl, {
                root: _self.publicFolder
              });
            } else {
              res.sendfile(_self.options.public.default, {
                root: _self.publicFolder
              });
            }
            break;
          default:
            next();
        }
      };
    }
  };

  module.exports = FileSystemMiddleware;
})();

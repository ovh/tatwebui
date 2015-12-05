/*global require,console,__dirname*/
(function() {
  'use strict';
  var config = require('./config.json');
  var extend = require('extend');
  var express = require('express');
  var url = require('url');
  var app = express();
  var querystring = require('querystring');

  var https;
  if (config.proxy.tatEngine.scheme === "https") {
    https = require('https');
  } else {
    https = require('http');
  }

  var getPostData = function(req) {
    if ((req.body) && ('object' === typeof req.body) && (Object.keys(req.body)
        .length)) {
      return JSON.stringify(req.body);
    }
    return null;
  };

  // Cross domain
  app.use(new(require('./middlewares/cors-middleware.js'))({
    app: app
  }).middleware());

  // Proxy
  app.use(require('body-parser').json());
  app.all('/*', function(req, res) {
    var proxyOptions = {
      path: req.url,
      method: req.method,
      headers: req.headers,
      host: config.proxy.tatEngine.host,
      port: config.proxy.tatEngine.port
    };

    var postData = getPostData(req);

    delete proxyOptions.headers.referer;
    proxyOptions.headers['content-length'] = postData ? postData.length :
      0;
    proxyOptions.headers["content-type"] = 'application/json';
    proxyOptions.headers.host = proxyOptions.host + ':' + proxyOptions.port;
    delete proxyOptions.headers.origin;
    delete proxyOptions.headers['user-agent'];
    if (proxyOptions.scheme === "https") {
      proxyOptions.rejectUnauthorized = (proxyOptions.sslInsecureSkipVerify !==
        true);
    }

    var postReq = https.request(proxyOptions, function(response) {

      var str = '';

      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('error', function(err) {
        res.status(response.statusCode).send(err);
      });

      response.on('end', function() {
        app.logger('Closing connection');
        res.status(response.statusCode).send(str);
      });

    });

    if (postData) {
      app.logger('Sending post data', postData);
      postReq.write(postData);
    }
    postReq.end();
  });

  module.exports = app;

})();

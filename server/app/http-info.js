/*global require,module*/
(function() {
  'use strict';
  var HttpInfo = function(req) {
    this.req = req;
  };

  HttpInfo.prototype = {
    /**
     * Get the method of the request
     * @return {string} method
     */
    getHttpMethod: function() {
      if (this.req.query.method) {
        return this.req.query.method.toUpperCase();
      } else {
        return this.req.method.toUpperCase();
      }
    },

    /**
     * Get the full path of a requested file
     * @return {string}     full path
     */
    getFullPath: function() {
      // delete first '/' if exists and all the string after a '?'
      var resource = this.req.url.replace(/^\//, '').replace(/[\?].*/, '');
      return resource.length > 0 ? resource : null;
    }
  };

  module.exports = HttpInfo;

})();

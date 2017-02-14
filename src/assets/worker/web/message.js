importScripts('../common.js');

onmessage = function (e) {
  loadMessages(e.data.user, e.data.api, e.data.filter);
};

function loadMessages (user, api, filter) {
  if (user && api) {
    setInterval(function () {
      var url = '/topics' + filter.topic;
      postMessage(httpCall(url, api, user));
    }, 2000);
  }
}

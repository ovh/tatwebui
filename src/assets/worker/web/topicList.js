importScripts('../common.js');

var started = false;

onmessage = function (e) {
  loadTopics(e.data.user, e.data.api);
};

function loadTopics (user, api) {
  if (user && api) {
    setInterval(function () {
      var url = '/topics';
      postMessage(httpCall(url, api, user));
    }, 2000);
  }
}

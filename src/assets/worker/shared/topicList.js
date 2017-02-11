importScripts('../common.js');

var workerStarted = false;
var ports = [];
var call = {};

onconnect = function (e) {
  if(!e.ports || e.ports.length === 0) {
    return;
  }
  // Register worker + give it an ID
  ports.push(e.ports[0]);
  var id = ports.length;

  // Return ID to caller
  e.ports[0].postMessage({'worker_id': id});

  // Receive msg
  e.ports[0].onmessage = function (e) {
    // Run worker
    if(!workerStarted) {
      workerStarted = true;
      loadTopics(e.data.user, e.data.api);
    }
  };
};

/**
 * Load all topics
 * @param user
 * @param api
 */
function loadTopics(user, api) {
  if(user && api) {
    callAPI(user, api);
    setInterval(function () {
      callAPI(user, api);
    }, 2000);
  }
}

function callAPI(user, api) {
  httpCallSharedWorker('/topics', api, user, postCall);
}

function postCall(response) {
}

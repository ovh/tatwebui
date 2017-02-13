importScripts('../common.js');

var workerStarted = false;
var ports = [];
var topic;

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
    if (e.data.filter) {
      topic = e.data.filter.topic;
    }

    // Run worker
    if(!workerStarted) {
      workerStarted = true;
      loadMessages(e.data.user, e.data.api);
    }
  };
};

/**
 * Load all topics
 * @param user
 * @param api
 */
function loadMessages(user, api) {
  if(user && api) {
    callAPI(user, api);
    setInterval(function () {
      callAPI(user, api);
    }, 2000);
  }
}

function callAPI(user, api) {
  if (topic) {
	  httpCallSharedWorker('/messages' + topic, api, user, postCall);
  }
}

function postCall(response) {
}

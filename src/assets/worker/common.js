var apiTestEnv = 'foo.bar'; // url for test cf environments/environment.ts

function httpCall (path, host, user) {
  if (host !== apiTestEnv) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', host + path, false, null, null);
    xhr.setRequestHeader("Tat_password", user.password);
    xhr.setRequestHeader("Tat_username", user.username);
    xhr.send(null);
    if (xhr.status === 200) {
      return xhr.responseText;
    }
    return null;
  }
}

function httpCallSharedWorker (path, host, user, callback) {
  if (host !== apiTestEnv) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', host + path, false, null, null);
    xhr.setRequestHeader("Tat_password", user.password);
    xhr.setRequestHeader("Tat_username", user.username);

    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // for each subscription, give response
          ports.forEach(function (p) {
            p.postMessage(xhr.responseText);
          });
          callback(xhr.responseText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
  }
}

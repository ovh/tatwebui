importScripts('../common.js');

onmessage = function (e) {
	loadTopics(e.data.user, e.data.api);
};

function loadTopics(user, api) {
	var url = '/topics';
	if(user
		&& api) {
		postMessage(httpCall(url, api, user));
		setInterval(function () {
			console.log('refreshing topics...');
			postMessage(httpCall(url, api, user));
		}, 10000);
	}
}

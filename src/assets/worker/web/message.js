importScripts('../common.js');

var filterDateUpdate = 0;

onmessage = function (e) {
	loadMessages(e.data.user, e.data.api, e.data.filter, e.data.topic);
};

function loadMessages(user, api, filter, topic) {
	if(user && api && topic) {
		setInterval(function () {
			var url = '/messages' + topic;
			var first = false;
			// Apply filter on request
			for (var k in filter) {
				if(filter.hasOwnProperty(k)) {
					if(!first) {
						url += '?';
					} else {
						url += '&';
					}

					url += k + '=' + filter[k];
				}
			}
			if (!filter['dateMinUpdate'] && filterDateUpdate != 0) {
				url += '&dateMinUpdate='+ filterDateUpdate;
			}
			var response = httpCall(url, api, user);

			// Parse response
			var jsonResponse = JSON.parse(response);

			// Update date Update
			var maxUpdate = 0;
			if (jsonResponse.messages && jsonResponse.messages.length > 0) {
				jsonResponse.messages.splice(jsonResponse.messages.length -1, 1);
				jsonResponse.messages.forEach(function (m) {
					if (m.dateUpdate > maxUpdate) {
						maxUpdate = m.dateUpdate;
					}
				});
			}
			if (maxUpdate != 0) {
				filterDateUpdate =maxUpdate;
			}
			if (jsonResponse.messages && jsonResponse.messages.length > 0) {
				postMessage(jsonResponse);
			}
		}, 2000);
	}
}
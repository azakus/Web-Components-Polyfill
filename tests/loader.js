module('Loader', {
	setup: function() {
		var mockXhr = function(){};
		mockXhr.prototype = {
			status: 200,
			response: "mock",
			open: function(inMethod, inUrl, inSync) {
				this.sync = inSync;
			},
			addEventListener: function(inEvent, inFunc) {
				this.readyState = 4;
				this.onloadend = inFunc;
			},
			send: function(){
				var f = this.onloadend;
				if (this.sync) {
					f();
				} else {
					setTimeout(f, 0);
				}
			}
		}
		window.replacedXHR = XMLHttpRequest;
		window.XMLHttpRequest = mockXhr;
		this.createComponentsLink = function(url) {
			var link = document.createElement('link');
			link.setAttribute("rel", 'components');
			link.setAttribute("href", url);
			return link;
		};
	},
	teardown: function() {
		window.XMLHttpRequest = window.replacedXHR;
	}
});

asyncTest("loadDocument must convert link tags into HTMLDocument instances", 2, function() {
	//
	var urls = ['http://monkey/', 'http://bear/', 'http://fish/'];
	var links = urls.map(this.createComponentsLink);
	//
	polyfill.loader.oncomplete = function() {
		var docs = [];
		urls.forEach(function(u) {
			docs.push(polyfill.loader.docs[u]);
		});
		equal(docs.length, 3);
		console.log(polyfill.loader.docs);
		ok(docs.every(function(d) { return d instanceof HTMLDocument }));
	};
	links.forEach(function(l) {
		polyfill.loader.loadDocument(l, function(){});
	});
	//
	start();
});

test("Loader will cache documents", 1, function() {
	// http://monkey was defined in a previous test
	ok(polyfill.loader.cached("http://monkey/", function(){}));
});


asyncTest('end-to-end test', 1, function() {
	var link = this.createComponentsLink('resources/char.txt');
	document.body.appendChild(link);
	//
	window.XMLHttpRequest = window.replacedXHR;
	polyfill.loader.loadDocument(link, function(){});
	polyfill.loader.oncomplete = function() {
		console.log(polyfill.loader.docs);
		var doc = polyfill.loader.docs[link.href];
		equal(doc.body.innerHTML, 'A')
	}
	start();
});

module("Paths");

test("Absolute paths are indentified", 3, function() {
	var paths = ["data:", "http://", "https://"];
	paths.forEach(function(p) {
		ok(polyfill.path.isAbsUrl(p));
	});
});

test("URLs are compressed correctly", function() {
	var urls = [
		{ in: "foo/bar/../baz", out: "foo/baz" },
		{ in: "foo/../bar/baz", out: "bar/baz" },
		{ in: "foo/bar/baz/..", out: "foo/bar" }
	];
	expect(urls.length);
	urls.forEach(function(u){
		equal(polyfill.path.compressUrl(u.in), u.out);
	});
});

test("makeRelPath makes correct relative paths", 1, function() {
	var source = "foo/bar/baz/quxx/", target = "foo/bar/baz/zeph";
	equal(polyfill.path.makeRelPath(source, target), "../zeph");
});

test("Document URL can be obtained from a node", 1, function() {
	equal(polyfill.path.documentUrlFromNode(document.body), location.toString());
});

test("Source and Href urls are resolved correctly", 2, function() {
	var src = "resources/logo.jpg";
	var i = document.createElement("img");
	i.src = src;
	i.style.display = "none";
	document.body.appendChild(i);
	var ds = document.createElement("div");
	ds.setAttribute("src", src);
	document.body.appendChild(ds);
	var dh = document.createElement("div");
	dh.setAttribute("href", src);
	document.body.appendChild(dh);
	equal(polyfill.path.nodeUrl(ds), i.src, "src ok");
	equal(polyfill.path.nodeUrl(dh), i.src, "href ok");
	document.body.removeChild(i);
	document.body.removeChild(ds);
	document.body.removeChild(dh);
});

test("CSS urls are relativized correctly", 1, function() {
	var src = "resources/logo.jpg";
	var i = document.createElement("img");
	i.src = src;
	i.style.display = "none";
	document.body.appendChild(i);
	var durl = polyfill.path.documentUrlFromNode(i);
	var iurl = "url(" + i.src + ")";
	var eurl = "url(resources/logo.jpg)";
	equal(polyfill.path.makeCssUrlsRelative(iurl, durl), eurl);
	document.body.removeChild(i);
});

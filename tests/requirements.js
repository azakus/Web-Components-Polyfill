module("Requirements");

test('WebKitShadowRoot is required', 1, function() {
    equal(typeof window.WebKitShadowRoot, "function");
});

test("Function.bind exists", 1, function() {
	ok((function(){}).bind);
});


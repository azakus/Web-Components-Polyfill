module('DeclarationFactory', {
	setup: function() {
		this.actualError = window.console.error;
		window.console.error = function(message) {
			this.error = message;
		}.bind(this);
		this.getDeclaration = function() {
			// FIXME relies on shared registry
			return polyfill.declarationRegistry.registry["foo"];
		};
	},
	teardown: function() {
		window.console.error = this.actualError;
	}
});

test('.createDeclaration must require "name" attribute', function() {
	var element = document.createElement('div');
	polyfill.declarationFactory.createDeclaration(element);
	equal(this.error, 'name attribute is required.');
});

// extends defaults to 'div' ... no?'
/*
test('.createDeclaration must require "extends" attribute', function() {
    var element = document.createElement('div');
    element.setAttribute('name', 'foo');
    this.declarationFactory.createDeclaration(element);
    equal(this.error, 'extends attribute is required.');
});
*/

test('.createDeclaration must create new Declaration instance', function() {
	var element = document.createElement('div');
	element.setAttribute('name', 'foo');
	element.setAttribute('extends', 'div');
	polyfill.declarationFactory.createDeclaration(element);
	var declaration = this.getDeclaration();
	equal(declaration.__proto__, polyfill.Declaration.prototype);
});

test('.createDeclaration must set generated constructor on the window object', function() {
	var element = document.createElement('div');
	element.setAttribute('name', 'foo');
	element.setAttribute('extends', 'div');
	element.setAttribute('constructor', 'Moodle');
	polyfill.declarationFactory.createDeclaration(element);
	var declaration = this.getDeclaration();
	equal(window.Moodle, declaration.archetype.generatedConstructor);
	delete window.Moodle;
});

test('.createDeclaration must call declaration.evalScript for each script element that is ancestor of element', function() {
	var element = document.createElement('div');
	element.setAttribute('name', 'foo');
	element.setAttribute('extends', 'div');
	window.int = 0;
	element.appendChild(document.createElement('script')).textContent = 'int++;';
	element.appendChild(document.createElement('div')).appendChild(document.createElement('script')).textContent = 'int++;';
	polyfill.declarationFactory.createDeclaration(element);
	equal(window.int, 2);
});

test('.createDeclaration must set template for first template element that is ancestor of element', function() {
	var element = document.createElement('div');
	element.setAttribute('name', 'foo');
	element.setAttribute('extends', 'div');
	element.appendChild(document.createElement('template')).textContent = 'foo';
	element.appendChild(document.createElement('div')).appendChild(document.createElement('template')).textContent = 'bar';
	polyfill.declarationFactory.createDeclaration(element);
	var declaration = this.getDeclaration();
	equal(declaration.template.textContent, 'foo');
});

/*test('.createDeclaration must call oncreate (if specified) with Declaration as argument', function() {
	var element = document.createElement('div');
	element.setAttribute('name', 'foo');
	element.setAttribute('extends', 'div');
	var count = 0;
	polyfill.declarationFactory.oncreate = function(declaration) {
		count++;
		equal(declaration.__proto__, polyfill.Declaration.prototype);
	}
	polyfill.declarationFactory.createDeclaration(element);
	equal(count, 1);
	delete polyfill.declarationFactory.oncreate;
});*/

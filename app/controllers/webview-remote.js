/***
 * @module controllers/webviewDemo
 *
 * @file This controller handles remote webview display and bi-directional communication
 *
 * To test this you can do the following terminal commands:
 * $ npm install http-server -g
 * $ http-server [APPROOT]/assets/web/
 * Then create this controller with these args: {url: http://localhost:8080/demo.html}
 */

var args = arguments[0] || {};

$.webview.url = 'http://10.0.2.2:8080/demo.html';

exports.sendDataToWebView = sendDataToWebView;

init();

/**
 * @function init
 * @summary Let's go!
 * @returns {void}
 */
function init() {
	addEventListeners();

	setTimeout(function () {
		sendDataToWebView();
	}, 5000);
}

/**
 * @function addEventListeners
 * @summary Add event listeners
 * @returns {void}
 */
function addEventListeners() {
	var schemaOrString = 'webview';
	$.webview.addEventListener('beforeload', function(_e) {
		if (_e.url.indexOf(schemaOrString) > -1) {
			$.webview.stopLoading();
			handleCommand(_e.url);
		} 		
	});
}

/**
 * @function removeEventListeners
 * @summary Garbage collection
 * @returns {void}
 */
function removeEventListeners() {
	$.webview.removeEventListener('beforeload', function() {
		
	});
}

/**
 * @function handleCommand
 * @param {string} _command Command to parse and execute
 * @returns {void}
 */
function handleCommand(_url) {
	var XCallbackURL = require('XCallbackURL');
	var URL = XCallbackURL.parse(_url);
	var action = URL.action();
	var params = URL.params();

	if (action === 'SOME_ACTION') {
		// do something
	}
}

/**
 * @function sendDataToWebView
 * @summary Send Data to WebView
 * @param {object} _data Data to send to the webview
 * @returns {void}
 */
function sendDataToWebView(_data) {
	// @TODO sanitize the data, and do so on the server
	$.webview.evalJS('document.location = "webview://x-callback-url/openBiometrics"');
}


## ti.remote.webview.send-and-receive
> Please note this was a Proof of Concept implementation.  That being said this should work with any version of titanium that supports the `beforeload` event on a WebView.  I'd guess this is all versions that would be currently used, but I haven't tested older than Ti SDK 6.X

*Ideas, Issues, and Pull Requests are welcomed!* 

### Motivation

To attempt to overcome some limitations with Titanium's built-in WebViews for iOS and Android, when it comes to remote HTML Javascript communication with native apps,.

The prime reason for needing this ability is to provide access to some native Titanium app functionality **from** the remote website's Javascript. 

This is a lightweight implementation that was the only one I was able to get to work on **BOTH Android and iOS**, and got the recommendation from somebody on TiSlack after trying **multiple other ways**.

### Technical Implementation

This works by Titanium intercepting links **before** they open and being able to decide what to do based on the link, or really anything thing else arbitrary you can think of.  You can choose to prevent them from opening, or make them with a url schema that wouldn't trigger anything anyways, like my example of `webview://` 
> There might be a way to leverage this with deep-linking integration, which helped drive my XCallbackURL usage


### Limitations

#### Amount of data to send
The limitation would come with the length of data you could pass in the url, but it's apparently quite large according to [this Quora question](https://www.quora.com/How-long-can-a-URL-be).  They don't list chrome but they have Safari at **80k characters**.

Also while writing the limitations just now, I had an idea that this could invoke something in Titanium that would execute an `evalJS()` so that you could pass data differently, but just use this method to **initiate** the logical sequence to overcome this limitation. 

#### URL Encoding
This should be easy to solve but if you want to send JSON it will have to be sent in a url string, or possibly trigger Titanium to perform an `evalJS()` on the webpage to return it in a more customary manner.  I'm not quite sure the pros/cons of this approach. 

I will update this repo when I have time to use `form-urlencoded` found [here](https://github.com/iambumblehead/form-urlencoded/blob/master/form-urlencoded.js)... or would *gladly accept a PR* for this functionality!

### Usage
##### Remote webview code

See: `remote-example.html` showing an example of a remote webpage. It shows how custom links can be used to send data to Titanium.  

Currently it's just a link with custom url scheme used to identify it:
```html
<a href="webview://x-callback-url/doSomething1">Send 'doSomething1'</a>
```
This should work too:
```javascript
function sendDataToTi(_schema, _string) {
	document.location = _schema + '://' + _string;
}

sendDataToTi('[URL SCHEMA TO CHECK FOR IN TITANIUM]', '[STRING DATA TO SEND]');
```

##### Titanium code

```javascript
var schemaOrString = 'webview';

$.webview.addEventListener('beforeload', function(_e) {
	if (_e.url.indexOf(schemaOrString) > -1) {
		$.webview.stopLoading();
		handleCommand(_e.url);
	}
});

function handleCommand(_url) {
	var XCallbackURL = require('XCallbackURL');
	var URL = XCallbackURL.parse(_url);
	var action = URL.action();
	var params = URL.params();
	if (action === 'SOME_ACTION') {
		// do something
	}
}
```

Here's more information about [x-callback-url](http://x-callback-url.com/)


### Future

Make this a widget to encapsulate logic and optional x-callback-url library

----------

Author : @shouse  March 2016


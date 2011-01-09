var FB_MAILTO = {
	load : function () {
		removeEventListener("load", FB_MAILTO.load, false);
		
		var firefoxBrowser = document.getElementById("appcontent");

		if (firefoxBrowser) {
			firefoxBrowser.addEventListener("DOMContentLoaded", FB_MAILTO.DOMContentLoaded, false);
		}
		else {
			var fennecBrowser = document.getElementById("browsers");
		
			if (fennecBrowser) {
				fennecBrowser.addEventListener("load", FB_MAILTO.DOMContentLoaded, true);
			}
		}
		
		addEventListener("unload", FB_MAILTO.unload, false);
	},

	unload : function () {
		removeEventListener("unload", FB_MAILTO.unload, false);
		
		var firefoxBrowser = document.getElementById("appcontent");

		if (firefoxBrowser) {
			firefoxBrowser.removeEventListener("DOMContentLoaded", FB_MAILTO.DOMContentLoaded, false);
		}
		else {
			var fennecBrowser = document.getElementById("browsers");
		
			if (fennecBrowser) {
				fennecBrowser.removeEventListener("load", FB_MAILTO.DOMContentLoaded, true);
			}
		}
	},
	
	DOMContentLoaded : function (event) {
		if (event.originalTarget instanceof HTMLDocument) {
			var page = event.originalTarget;
			
			if (page.location.href.match(/facebook\.com\//i)) {
				setTimeout(FB_MAILTO.addMailto, 500, page);//(page);
			}
		}
	},
	
	addMailto : function (page) {
		var cells = page.getElementsByClassName("uiListItem");
		
		for (var i = 0, _len = cells.length; i < _len; i++) {
			var cell = cells[i];
			
			var html = cell.innerHTML;
			
			if (html.indexOf("mailto:") == -1 && html.indexOf("@") != -1) {
				cell.innerHTML = '<a href="mailto:' + html + '">'+html+'</a>';
			}
		}
	},
	
	log : function (msg) {
		var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
		consoleService.logStringMessage("FB_MAILTO: " + msg);
	}
};

function FB_MAILTO_LISTENER() {
	this.register();
}

FB_MAILTO_LISTENER.prototype = {
	observe : function (subject, topic, data) {
		if ((typeof Components == 'undefined') || !Components) return;
		
		var request = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
		
		if (request.URI.spec.match(/facebook.com\/ajax\/profile/i)){
			if (typeof gBrowser != 'undefined') {
				var num = gBrowser.browsers.length;
				
				for (var i = 0; i < num; i++) {
					var b = gBrowser.getBrowserAtIndex(i);
					
					// This is hacky. Should really do something like MozAfterPaint on this tab.
					setTimeout(FB_MAILTO.addMailto, 500, b.contentDocument);
				}
			}
			else {
				var browsers = Browser.browsers;

				for (var i = 0; i < browsers.length; i++) {
					var b = browsers[i];
					setTimeout(FB_MAILTO.addMailto, 500, b.contentDocument);
				}
			}
		}
	},
	
	register : function () {
		var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
		observerService.addObserver(this, "http-on-examine-response", false);
	},
	
	unregister : function () {
		var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
		observerService.removeObserver(this, "http-on-examine-response");
	}
};

var fb_mailto_listener = new FB_MAILTO_LISTENER();
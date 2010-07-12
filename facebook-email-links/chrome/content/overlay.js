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
				FB_MAILTO.addMailto(page);
			}
		}
	},
	
	addMailto : function (page) {
		var info = page.getElementById("info_section_info_contact");
		
		if (info) {
			var dl = info.getElementsByClassName("info");
			
			if (dl && dl.length > 0) {
				dl = dl[0];
				
				var dds = dl.getElementsByTagName("dd");
				
				for (var i = 0; i < dds.length; i++) {
					var dd = dds[i];
					var html = dd.innerHTML;
					
					var hasEmail = html.indexOf("@");
					
					if (hasEmail) {
						var linkedParts = [];
						
						parts = html.replace(/<[^>]+>/g, " ").replace(/^\s+|\s+$/g, "").split(/\s/);
						
						for (var i = 0; i < parts.length; i++) {
							var part = parts[i];
							
							if (part.indexOf("@")) {
								part = '<a href="mailto:'+part+'">'+part+'</a>';
							}
							
							linkedParts.push(part);
						}
						
						html = linkedParts.join("<br />");
						
						dd.innerHTML = html;
						break;
					}
				}
			}
		}
	}
};

function FB_MAILTO_LISTENER() {
	this.register();
}

FB_MAILTO_LISTENER.prototype = {
	observe : function (subject, topic, data) {
		if ((typeof Components == 'undefined') || !Components) return;
		
		var request = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
		
		if (request.URI.spec.match(/facebook.com\/ajax\/profile\/tab/i)){
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
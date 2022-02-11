/* global api */
'use strict';

	var extens = [
					'avi', 'mp4', 'webm', 'flv', 'mov', 'ogv', '3gp', 'mpg', 'wmv', 'swf', 'mkv',
					'pcm', 'wav', 'aac', 'ogg', 'wma', 'flac', 'mid', 'mka', 'm4a', 'voc',
					'png','jpeg','jpg','img','svg','webp','apng','avif','bmp','ico','tiff','gif'
				  ];
				  
var observer = new MutationObserver(function(mutations) {
	for (var m of mutations) {
		for (var node of m.addedNodes) {
			var elements = node.getElementsByTagName("a");
			var elementsLength = elements.length;
			for (var i = 0; i < elementsLength; i++) {
			
				if(extens.some(v => elements[i].href.toLowerCase().endsWith('.'+v)) ){
				let li = document.createElement('img');
				li.width="20";
				li.style.width = "20px";
				li.src =  browser.extension.getURL('data/p.png');		
				
				let uri = document.createElement('a');
				uri.href = "http://nowhere.notexist"+"?burlll=" +btoa(elements[i].href);
				uri.setAttribute("target","_blank");
				uri.style.width = "20px";
				uri.appendChild(li);				
				elements[i].parentNode.insertBefore(uri, elements[i].nextSibling);
				}
			}
		}
	}
});

var config = { attributes: true, childList: true, subtree: true, characterData: true};
observer.observe(window.document, config);

var elements = document.getElementsByTagName("a");
var elementsLength = elements.length;
for (var i = 0; i < elementsLength; i++) {

		if(extens.some(v => elements[i].href.toLowerCase().endsWith('.'+v))){
			let li = document.createElement('img');
			li.width="20";
			li.src = browser.extension.getURL('data/p.png');		
			li.style.width = "20px";			
				let uri = document.createElement('a');
					uri.href =  "http://nowhere.notexist"+"?burlll=" + btoa(elements[i].href);
			uri.setAttribute("target","_blank");
			uri.style.width = "20px";
				uri.appendChild(li);
			elements[i].parentNode.insertBefore(u, elements[i].nextSibling);
		}
}
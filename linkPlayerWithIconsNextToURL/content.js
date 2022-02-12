/* global api */
'use strict';

	var extens = [
					'avi', 'mp4', 'webm', 'flv', 'mov', 'ogv', '3gp', 'mpg', 'wmv', 'swf', 'mkv', 'vob',
					'pcm', 'wav', 'aac', 'ogg', 'wma', 'flac', 'mid', 'mka', 'm4a', 'voc',
					'png','jpeg','jpg','img','svg','webp','apng','avif','bmp','ico','tiff','gif'
				  ];
	var extens5 = [
					'png','jpeg','jpg','img','svg','webp','apng','avif','bmp','ico','tiff','gif'
				  ];
				  
				  
			  
var observer = new MutationObserver(function(mutations) {
	for (var m of mutations) {
		for (var node of m.addedNodes) {
			if(!(typeof node !== "undefined"&& node.getElementsByTagName)) return;
			var elements = node.getElementsByTagName("a");
			var elementsLength = elements.length;
			for (var i = 0; i < elementsLength; i++) {
			
				if(extens.some(v => elements[i].href.toLowerCase().endsWith('.'+v)) ){
				let li = document.createElement('img');
				li.width="20";
				li.style.width = "20px";
				if(extens5.some(v => elements[i].href.toLowerCase().endsWith('.'+v)) ){
				li.src =  browser.runtime.getURL('data/po.png');		}
				else{
					li.src =  browser.runtime.getURL('data/p.png');	
				}
				
				let uri = document.createElement('a');
				uri.href = "http://nowhere.notexist"+"?burlll=" +btoa(elements[i].href);
				uri.setAttribute("target","_blank");
				uri.style.width = "20px";
				uri.setAttribute("id","remeovemeifyouwantoto");
				uri.appendChild(li);				
				elements[i].parentNode.insertBefore(uri, elements[i].nextSibling);
				}
			}
		}
	}
});

	var config = { attributes: true, childList: true, subtree: true, characterData: true};
	
	

function oaddthem(){
		observer.observe(window.document, config);
}
function addthem(){

	var elements = document.getElementsByTagName("a");
	var elementsLength = elements.length;
	for (var i = 0; i < elementsLength; i++) {

			if(extens.some(v => elements[i].href.toLowerCase().endsWith('.'+v))){
				let li = document.createElement('img');
				li.width="20";
				if(extens5.some(v => elements[i].href.toLowerCase().endsWith('.'+v)) ){
					li.src =  browser.runtime.getURL('data/po.png');		}
					else{
						li.src =  browser.runtime.getURL('data/p.png');	
					}
							
				li.style.width = "20px";			
					let uri = document.createElement('a');
						uri.href =  "http://nowhere.notexist"+"?burlll=" + btoa(elements[i].href);
				uri.setAttribute("target","_blank");
								uri.setAttribute("id","remeovemeifyouwantoto");
				uri.style.width = "20px";
					uri.appendChild(li);
				elements[i].parentNode.insertBefore(uri, elements[i].nextSibling);
			}
	}

}
chrome.runtime.sendMessage({method: "getLocalStorage", key: "show-icons"}, function(response) {
		if(response.data)addthem();
		if(response.data)oaddthem();
	});
	
function rethem(){
	
	var elements = document.getElementsByTagName("a");
	var elementsLength = elements.length;
	for (var i = 0; i < elementsLength; i++) {
			if(elements[i].href.toLowerCase().includes('burlll')){
				elements[i].innerHTML = "";
			}
	}
	observer.disconnect();
}

function logStorageChange(changes, area) {
  console.log("Change in storage area: " + area);

  let changedItems = Object.keys(changes);

  for (let item of changedItems) {	
	 if(changes[item].newValue){
     	 clearTimeout(addthem);
		setTimeout(addthem,100);
     	 clearTimeout(oaddthem);
		setTimeout(oaddthem,140);
	 }else{
	 	 clearTimeout(rethem);
		setTimeout(rethem,100);
	 }
  }
}

browser.storage.onChanged.addListener(logStorageChange);	  
				  
	
	
	
	
setInterval(dontSleep, 3000);

function dontSleep(){
    let popup = document.getElementById('confirm-button');
    if(popup != null){
		let parent = popup.parentNode.parentNode.parentNode.parentNode;
    
		if (popup != null && getComputedStyle(parent).display != "none"){
			popup.click();
		}
	}
	try{
		let d =document.querySelector(".ytp-autonav-endscreen-upnext-play-button");
		if(d!=null&&d.href!=""){
			    if (isIdle()) {
					window.location=document.querySelector(".ytp-autonav-endscreen-upnext-play-button").href;	
						}
		}
	}catch{}
}
	




var ynsInjection =
  '(' +
  function () {
    const tag = '[Youtube NonStop]';
    const isYoutubeMusic = window.location.hostname === 'music.youtube.com';

    const popupEventNodename = isYoutubeMusic ? 'YTMUSIC-YOU-THERE-RENDERER' : 'YT-CONFIRM-DIALOG-RENDERER';

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let appObserver = null;
    const appName = isYoutubeMusic ? 'ytmusic-app' : 'ytd-app';
    const popupContainer = isYoutubeMusic ? 'ytmusic-popup-container' : 'ytd-popup-container';

    let pauseRequested = false;
    let pauseRequestedTimeout;
    const pauseRequestedTimeoutMillis = 5000;
    const idleTimeoutMillis = 5000;
    let lastInteractionTime = new Date().getTime();

    let videoElement = null;

    function log(message) {
      console.log(`${tag}[${getTimestamp()}] ${message}`);
    }

    function debug(message) {
      console.debug(`${tag}[${getTimestamp()}] ${message}`);
    }

    function asDoubleDigit(value) {
      return value < 10 ? '0' + value : value;
    }

    function getTimestamp() {
      let dt = new Date();
      let time = asDoubleDigit(dt.getHours()) + ':' + asDoubleDigit(dt.getMinutes()) + ':' + asDoubleDigit(dt.getSeconds());
      return time;
    }

    function isIdle() {
      return getIdleTime() >= idleTimeoutMillis;
    }

    function getIdleTime() {
      return new Date().getTime() - lastInteractionTime;
    }

    function listenForMediaKeys() {
      if (navigator.mediaSession === undefined) {
        log("Your browser doesn't seem to support navigator.mediaSession yet :/");
        return;
      }
      debug('Listening to "pause" media key...');
      navigator.mediaSession.setActionHandler('pause', () => {
        debug('Paused due to [media key pause]');
        pauseVideo();
      });
      navigator.mediaSession.yns_setActionHandler = navigator.mediaSession.setActionHandler;
      navigator.mediaSession.setActionHandler = (action, fn) => {
        if (action === 'pause') {
          debug("Blocked attempt to override media key 'pause' action");
          return;
        }
        navigator.mediaSession.yns_setActionHandler(action, fn);
      };
    }

    function listenForMouse() {
      const eventName = window.PointerEvent ? 'pointer' : 'mouse';
      debug(`Using ${eventName} events`);
      document.addEventListener(eventName + 'down', (e) => {
        processInteraction(eventName + 'down');
      });

      document.addEventListener(eventName + 'up', (e) => {
        processInteraction(eventName + 'up');
      });
    }

    function listenForKeyboard() {
      document.addEventListener('keydown', (e) => {
        processInteraction('keydown');
      });

      document.addEventListener('keyup', (e) => {
        processInteraction('keyup');
      });
    }

    function processInteraction(action) {
      if (pauseRequested) {
        debug(`Paused due to [${action}]`);
        pauseVideo();
        return;
      }
      lastInteractionTime = new Date().getTime();
    }

    function observeApp() {
      debug(`Observing ${appName}...`);
      appObserver = new MutationObserver((mutations, observer) => {
        overrideVideoPause();
      });

      appObserver.observe(document.querySelector(appName), {
        childList: true,
        subtree: true
      });
    }

    function listenForPopupEvent() {
      debug('Listening for popup event...');
      document.addEventListener('yt-popup-opened', (e) => {
        if (isIdle() && e.detail.nodeName === popupEventNodename) {
          debug('[closing popup]');
          document.querySelector(popupContainer).handleClosePopupAction_();
          pauseVideo();
          videoElement.play();
        }
      });
    }

    function overrideVideoPause() {
      if (videoElement?.yns_pause !== undefined) return;
      if (document.querySelector('video') === null) return;

      videoElement = document.querySelector('video');
      listenForMediaKeys();
      debug('Overriding video pause...');
      videoElement.yns_pause = videoElement.pause;
      videoElement.pause = () => {
        debug('Video pause requested');
        if (!isIdle()) {
          debug('Paused due to [pause]');
          pauseVideo();
          return;
        }
        pauseRequested = true;
        setPauseRequestedTimeout();
      };
    }

    function setPauseRequestedTimeout(justClear = false) {
      clearTimeout(pauseRequestedTimeout);
      if (justClear) return;
      pauseRequestedTimeout = setTimeout(() => {
        pauseRequested = false;
      }, pauseRequestedTimeoutMillis);
    }

    function pauseVideo() {
      videoElement?.yns_pause();
      pauseRequested = false;
      setPauseRequestedTimeout(true);
    }

    listenForMouse();
    listenForKeyboard();

    listenForPopupEvent();
    observeApp();

    log(`Monitoring YouTube ${isYoutubeMusic ? 'Music ' : ''}for 'Confirm watching?' action...`);
  } +
  ')();';

console.log(`[Youtube NonStop v${chrome.runtime.getManifest().version}]`);

var script = document.createElement('script');
script.textContent = ynsInjection;
(document.head || document.documentElement).appendChild(script);
script.remove();

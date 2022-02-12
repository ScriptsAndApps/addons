'use strict';

var thissheet = true;

//alert("Open debug log");
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function getCurrentWindowTabs() {
		  return browser.tabs.query({currentWindow: true});
}


let lastid = "";
function handleUpdated(tabId, changeInfo, tabInfo) {
	if(changeInfo.status == "loading"){
	  console.log("Updated tab: " + tabId);
	  lastid = "DoingThis";
	  myFunction();
	  setTimeout(myFunction, 60);
	  setTimeout(myFunction, 100);
	  setTimeout(myFunction, 1000);
	  setTimeout(myFunction, 3000);
	}
}

var imglist = ['png','jpeg','jpg','img','svg','webp','apng','avif','bmp','ico','tiff','gif'];

browser.tabs.onUpdated.addListener(handleUpdated);

function myFunction() {

	getCurrentWindowTabs().then((tabs) => {
		for (let tab of tabs) {
			if(tab.url.includes("?burlll="))
			{
				if(lastid == "DoingThis"){
					lastid = "done";
				}else{
					return;
				}
				browser.tabs.remove(tab.id);
				try{
					setTimeout(()=>{
					    onCommand({
						  src: atob(getParameterByName("burlll",tab.url))
						}).then(t => chrome.tabs.sendMessage(t.id, {
						  method: 'open-src',
						  src: atob(getParameterByName("burlll",tab.url))
						}));
					}, 100);		
					
				}catch{}
			}
		}
	});
}






const notify = message => chrome.notifications.create(null, {
  type: 'basic',
  iconUrl: '/data/icons/48.png',
  title: 'Media Player',
  message
});

const ports = [];
chrome.runtime.onConnect.addListener(port => {
  const index = ports.push(port) - 1;
  port.onDisconnect.addListener(() => {
    ports.splice(index, 1);
  });
});

const find = () => new Promise((resolve, reject) => {
  if (ports.length) {
    return resolve(ports[0].sender.tab);
  }
  reject(Error('no window'));
});

const onCommand = (options = {}) => find().then(tab => {
  chrome.windows.update(tab.windowId, {
    focused: true
  });
  chrome.tabs.update(tab.id, {
    highlighted: true
  });
  return tab;
}).catch(() => new Promise(resolve => chrome.storage.local.get({
  'width': 1100,
  'height': 600,
  'left': screen.availLeft + Math.round((screen.availWidth - 1100) / 2),
  'top': screen.availTop + Math.round((screen.availHeight - 600) / 2),
  'open-in-tab': false
}, prefs => {
  const args = new URLSearchParams();
 var asimg = '';
  if (options.src) {
	  if(imglist.some(v =>  options.src.toLowerCase().endsWith('.'+v))){
	  asimg="img";
	  }
		  
	  try{
			args.set('src', btoa(options.src));
			
	  } catch{
		   args.set('src', options.src);
	  }
  }
  args.set('mode', prefs['open-in-tab'] ? 'tab' : 'window');

  const url = 'data/player/index' + asimg + '.html?' + args.toString();
  
  if (prefs['open-in-tab']) {
    chrome.tabs.create({
      url
    }, resolve);
  }
  else {
    delete prefs['open-in-tab'];
    chrome.windows.create(Object.assign(prefs, {
      url,
      type: 'popup'
    }), w => resolve(w.tabs[0]));
  }
})));

chrome.browserAction.onClicked.addListener(() => {
  const next = () => chrome.tabs.executeScript({
    runAt: 'document_start',
    allFrames: true,
    matchAboutBlank: true,
    code: `[...document.querySelectorAll('video, audio, source')].map(e => {
      if (e.src && e.src.startsWith('http')) {
        try {
          e.pause();
        }
        catch (e) {}
        return e.src;
      }
    })`
  }, results => {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      onCommand();
    }
    else {
      results = results.flat().filter(a => a);
      if (results.length) {
        onCommand({
          src: results[0]
        }).then(t => chrome.tabs.sendMessage(t.id, {
          method: 'open-src',
          src: results[0]
        }));
      }
      else {
        onCommand();
      }
    }
  });
  chrome.storage.local.get({
    'request-active-tab': true
  }, prefs => {
    if (prefs['request-active-tab']) {
          notify(`Disabled in-page icons`);
         thissheet  = false;     
	 chrome.storage.local.set({
        'request-active-tab': false
      });
      
    }
    else {
		   notify(`Enabled in-page icons`);
		 thissheet  = true;
      chrome.storage.local.set({
        'request-active-tab': true
      });
    }
  });
});

window.save = prefs => {
  chrome.storage.local.set(prefs);
};

// context-menu
(callback => {
  chrome.runtime.onInstalled.addListener(callback);
  chrome.runtime.onStartup.addListener(callback);
})(() => {
  chrome.contextMenus.create({
    id: 'open-src',
    title: 'Open in Media Player',
    contexts: ['video', 'audio'],
    documentUrlPatterns: ['*://*/*'],
    targetUrlPatterns: ['*://*/*']
  });
  chrome.contextMenus.create({
    title: 'Open/Play with Media Player',
    id: 'play-link',
    contexts: ['link'],
    targetUrlPatterns: [
      'avi', 'mp4', 'webm', 'flv', 'mov', 'ogv', '3gp', 'mpg', 'wmv', 'swf', 'mkv', 'vob',
      'pcm', 'wav', 'aac', 'ogg', 'wma', 'flac', 'mid', 'mka', 'm4a', 'voc', 'm3u8','avi',
	'png','jpeg','jpg','img','svg','webp','apng','avif','bmp','ico','tiff','gif'
    ].map(a => '*://*/*.' + a),
    documentUrlPatterns: ['*://*/*']
  });
  chrome.contextMenus.create({
    id: 'previous-track',
    title: 'Previous track',
    contexts: ['browser_action']
  });
  chrome.contextMenus.create({
    id: 'next-track',
    title: 'Next track',
    contexts: ['browser_action']
  });
  chrome.contextMenus.create({
    id: 'toggle-play',
    title: 'Toggle play/pause',
    contexts: ['browser_action']
  });
  chrome.contextMenus.create({
    id: 'test-audio',
    title: 'Test Playback',
    contexts: ['browser_action']
  });
  chrome.storage.local.get({
    'open-in-tab': false
  }, prefs => {
    chrome.contextMenus.create({
      id: 'open-in-tab',
      title: 'Open Player in Tab',
      contexts: ['browser_action'],
      type: 'checkbox',
      checked: prefs['open-in-tab']
    });
  });
});
chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === 'open-in-tab') {
    chrome.storage.local.set({
      'open-in-tab': info.checked
    });
  }
  else if (info.menuItemId === 'test-audio') {
    chrome.tabs.create({
      url: 'https://webbrowsertools.com/audio-test/'
    });
  }
  else if (info.menuItemId === 'open-src') {
    onCommand({
      src: info.srcUrl
    }).then(t => chrome.tabs.sendMessage(t.id, {
      method: 'open-src',
      src: info.srcUrl
    }));
  }
  else if (info.menuItemId === 'play-link') {
    onCommand({
      src: info.linkUrl
    }).then(t => chrome.tabs.sendMessage(t.id, {
      method: 'open-src',
      src: info.linkUrl
    }));
  }
  else {
    find().then(t => chrome.tabs.sendMessage(t.id, {
      method: info.menuItemId
    })).catch(() => notify('Please open "Media Player" and retry'));
  }
});
chrome.commands.onCommand.addListener(method => find().then(t => chrome.tabs.sendMessage(t.id, {
  method
})).catch(() => notify('Please open "Media Player" and retry')));

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage"){
		sendResponse({data: thissheet});
	}
    else
      sendResponse({}); // snub them.
});
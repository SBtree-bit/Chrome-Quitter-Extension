let time = 0;
let active = false;
chrome.runtime.onInstalled.addListener(async () => {
	chrome.storage.sync.set({ active: false, time: 0 })
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

		chrome.scripting.executeScript({
			target: {tabId: tabs[0].id},
			function: createPopup
		})
	})
})

function createPopup() {
	var banner = document.createElement("div")
	banner.className = "bannerChromeQuitter"
	var elem = document.createElement("div")
	elem.className = "banner__contentChromeQuitter"
	banner.appendChild(elem)
	elem = document.createElement("div")
	elem.className = "banner__textChromeQuitter"
	banner.appendChild(elem)
	elem.innerHTML = "<strong>Your chrome will quit in <span id='timeBannerChromeQuitter'>5:00</span></strong>"
	var style = document.createElement("style")
	style.innerHTML = `
		html, body {
			margin: 0;
		}

		.bannerChromeQuitter {
			background: #009579;
			z-index: 99999;
			position: fixed;
			left: 50%;
		}
		.banner__contentChromeQuitter {
			padding: 16px;
			max-width: 1000px;
			margin: 0 auto;
			display: flex;
			align-items: center;
		}
		.banner__textChromeQuitter {
			flex-grow: 1;
			line-height: 1.4;
			font-family: 'Quicksand', sans-serif;
			color: white;
		}
	`
	banner.style["margin-left"] = banner.width / 2;
	document.head.appendChild(style)
	document.body.firstChild.insertAdjacentElement('beforebegin', banner);
}

setInterval(async () => {
	let [tab] = await chrome.tabs.query({active: true, currentWindow: true})
	/*chrome.scripting.executeScript({
		target: {tabId: tab.id},
		function: createPopup
	})*/
	chrome.storage.sync.get(["active", "time"], function result() {
		if (result.active) {
			time = result.time;
			active = true;
		}
	})
	if (time != 0) {
		if (time == 5 * 60) {
			createPopup()
		} else if (time < 5 * 60) {
			document.getElementById('timeBannerChromeQuitter').innerHTML = Math.Floor(time / 60) + ":" + (time - (Math.Floor(time / 60) * 60))
		}
	}
}, 1000);

let time1 = 5 * 60;

setInterval(async function () {
	var main = function (time1) {
		document.getElementById('timeBannerChromeQuitter').innerHTML = Math.Floor(time1 / 60) + ":" + (time1 - (Math.Floor(time1 / 60) * 60))
	}
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		console.log(tabs)
		chrome.scripting.executeScript({
			argument: {time1},
			target: {tabId: tabs[0].id},
			function: main
		})
	})
	time1--;
}, 1000)

setInterval(() => {
	chrome.runtime.reload();
}, 10000);
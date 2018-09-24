class BackgroundExtension{

	highlightCurrentDom(){
		this.getCurrentTab().then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, {
				call: "highlightCurrentDom",
				args: {color: "orange"}
			});
		});
	}
	enableTopicsExtraction(){
		this.getCurrentTab().then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, {
				call: "enableTopicsExtraction"
			});
		});
	}
	getCurrentTab(callback) {
		return browser.tabs.query({
			active: true,
			currentWindow: true
		});
	}
	retrieveRelatedNews(args){

		return new Promise((resolve, reject) => {
			var oReq = new XMLHttpRequest();
			oReq.onload = function(e) {

				var parser = new DOMParser();
				var doc = parser.parseFromString(oReq.response, "text/html");

				console.log("paso 001");

				var news = doc.querySelectorAll(".item");
				console.log("paso 002", news);
				var jsonNews = [];

				news.forEach(elem => jsonNews.push(elem.querySelector(".title").innerText));
				console.log("paso 003", jsonNews);

				resolve(jsonNews);
			};

			oReq.open("GET", "https://www.....com/search?text=" + args.keywords);
			oReq.send();
		});
	}
}

var extension = new BackgroundExtension();

browser.browserAction.onClicked.addListener(() => {
  extension.enableTopicsExtraction();
});

browser.runtime.onMessage.addListener((request, sender) => {

	console.log("[background-side] calling the message: " + request.call);
	if(extension[request.call]){
		return extension[request.call](request.args);
	}
});
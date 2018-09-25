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

				var news = doc.querySelectorAll(".item");
				var jsonNews = [];

				news.forEach(elem => jsonNews.push(elem.querySelector(".title").innerText));

				resolve(jsonNews);
			};

			browser.storage.local.get("config").then(data => {
				oReq.open("GET", data.config.apiUrl + args.keywords);
				oReq.send();
			});
		});
	}
}

var startBackground = function(config) {

	var extension = new BackgroundExtension(config.apiUrl);

	browser.browserAction.onClicked.addListener(() => {
	  extension.enableTopicsExtraction();
	});

	browser.runtime.onMessage.addListener((request, sender) => {

		console.log("[background-side] calling the message: " + request.call);
		if(extension[request.call]){
			return extension[request.call](request.args);
		}
	});
}

function checkExpectedParameters(config){

	if (config == undefined)
		return false;

    var foundParams = ["apiUrl"].filter(param => (param && config.hasOwnProperty(param)));
    return (config.length == foundParams.length);
}

console.log(browser);

browser.storage.local.get("config").then(data => {

    if (!checkExpectedParameters(data.config)) {

        data.config = {
        	"apiUrl": ""
        };
        //Si no se setea, se puede perder consistencia con lo que se lee en la pagina de config
        browser.storage.local.set({ "config": data.config }).then(() => startBackground(data.config));
    }
    else startBackground(data.config);
});
class ContentPageManager{

	highlightCurrentDom(args){

		var sentiment = new Sentimood();

		document.querySelectorAll("label, p, h1, h2, h3").forEach(div => {

			var result = sentiment.analyze(div.textContent);
			if(div.style){
				if (result.score > 1) div.style["background-color"] = "green";
				else if (result.score <= -1) div.style["background-color"] = "red";
			}
		})
	}
}

var pageManager = new ContentPageManager();

//Listening for background's messages
browser.runtime.onMessage.addListener((request, sender) => {

	console.log("calling the message: " + request.call);
	if(pageManager[request.call]){
		pageManager[request.call](request.args);
	}
});
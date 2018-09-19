class ContentPageManager{

	highlightCurrentDom(args){
		document.querySelector("body").style["background-color"] = args.color;
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
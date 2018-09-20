class ContentPageManager{

	highlightCurrentDom(args){

		document.body.style["background-color"] = args.color;
	}
	enableTopicsExtraction(){
		document.querySelectorAll("div").forEach(div => {

			div.addEventListener("dblclick", (evt) => {
				
				evt.target.style["background-color"] = "yelow !important";
				evt.target.style["border"] = "3px solid yellow";

				var topics = this.extractTopics(evt.target);
				this.generateCloud(topics.out('frequency'));

				evt.stopImmediatePropagation();
			});
		});
	}
	generateCloud(topics){

		if(topics.length == 0){
			alert("not enogh words in the paragraph");
			return;
		}

		var div = this.createCloudContainer();
		document.body.appendChild(div);

		var adaptedTopics = [];

		topics.forEach(topic => {
			adaptedTopics.push({"text": topic.normal, "weight": topic.percent});
		});

		$(div).jQCloud(adaptedTopics);
	}
	createCloudContainer(){
		var div = document.createElement("div");
			div.style.width = "500px";
			div.style.height = "500px";
			div.style.position= "fixed";
		    div.style.background =  "white";
		    div.style.top =  "0px";
		    div.onclick = function(){
		    	this.remove();
		    }
		return div;
	}
	extractTopics(elem){
		
		return window.nlp(elem.innerText).topics();
	}
	applySentimentAnalysis(args){

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
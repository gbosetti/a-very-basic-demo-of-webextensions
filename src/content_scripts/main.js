class ContentPageManager{

	highlightCurrentDom(args){

		document.body.style["background-color"] = args.color;
	}
	enableTopicsExtraction(){
		
		document.querySelectorAll("div, p").forEach(div => {
			div.addEventListener("dblclick", (evt) => {
				
				this.highlightDomElement(evt.target);

				var topics = this.extractTopics(evt.target).out('frequency'); //get the named entities (people, places, organizations)
				if(topics.length == 0){
					alert("No named-entities were found");
					return;
				}

				this.generateCloud(topics);
				browser.runtime.sendMessage({
					"call": "retrieveRelatedNews",
					"args": {
						"keywords": topics[0].normal
					}
				}).then(tweets => {
					this.presentRelatedTweets(tweets);
				});

				evt.stopImmediatePropagation();
			});
		});
	}
	/*retrieveRelatedUserComments(keyword){

		return browser.runtime.sendMessage({
			"call": "listenForChanges" // podríamos mandar el dominio para verificar que sea del  mismo origen
		}).then( {} => {

			var iframe = this.createIframe("demo-sidebar-iframe");
				iframe.src = "https://... .com/search?f=news&q=" + keyword;
		});
	}*/
	presentRelatedTweets(tweets){

		var div = this.createContainer("300px", window.innerHeight + "px", (window.innerWidth - 300) + "px", "0px");
		document.body.appendChild(div);

		var title = document.createElement("h1");
			title.innerHTML = "Related news";

		div.appendChild(title);

		tweets.forEach(tweet => {
			div.appendChild(document.createElement("br"));
			div.appendChild(document.createTextNode(tweet));
		});
	}
	highlightDomElement(elem){

		elem.style["background-color"] = "yelow !important";
		elem.style["border"] = "3px solid yellow";
	}
	generateCloud(topics){

		var div = this.createContainer("400px", "400px", "0px", "0px");
		document.body.appendChild(div);

		var adaptedTopics = [];

		topics.forEach(topic => {
			adaptedTopics.push({"text": topic.normal, "weight": topic.percent});
		});

		$(div).jQCloud(adaptedTopics);
	}
	createContainer(width, height, left, top){
		var div = document.createElement("div");
			div.style.width = width;
			div.style.height = height;
			div.style.position= "fixed";
		    div.style.background =  "white";
		    div.style.top = top;
		    div.style.left = left;
		    div.style.zIndex =  this.getMaxZindex() + 1;

		    div.onclick = function(){
		    	this.remove();
		    }
		return div;
	}
	getMaxZindex() {

		return Array.from(document.querySelectorAll('body *'))
		.map(a => parseFloat(window.getComputedStyle(a).zIndex))
		.filter(a => !isNaN(a)).sort().pop();
	}
	removeStopWords(query){

		// https://github.com/6/stopwords-json/blob/master/dist/en.json
		var stopwords = ["a","a's","able","about","above","according","accordingly","across","actually","after","afterwards","again","against","ain't","all","allow","allows","almost","alone","along","already","also","although","always","am","among","amongst","an","and","another","any","anybody","anyhow","anyone","anything","anyway","anyways","anywhere","apart","appear","appreciate","appropriate","are","aren't","around","as","aside","ask","asking","associated","at","available","away","awfully","b","be","became","because","become","becomes","becoming","been","before","beforehand","behind","being","believe","below","beside","besides","best","better","between","beyond","both","brief","but","by","c","c'mon","c's","came","can","can't","cannot","cant","cause","causes","certain","certainly","changes","clearly","co","com","come","comes","concerning","consequently","consider","considering","contain","containing","contains","corresponding","could","couldn't","course","currently","d","definitely","described","despite","did","didn't","different","do","does","doesn't","doing","don't","done","down","downwards","during","e","each","edu","eg","eight","either","else","elsewhere","enough","entirely","especially","et","etc","even","ever","every","everybody","everyone","everything","everywhere","ex","exactly","example","except","f","far","few","fifth","first","five","followed","following","follows","for","former","formerly","forth","four","from","further","furthermore","g","get","gets","getting","given","gives","go","goes","going","gone","got","gotten","greetings","h","had","hadn't","happens","hardly","has","hasn't","have","haven't","having","he","he's","hello","help","hence","her","here","here's","hereafter","hereby","herein","hereupon","hers","herself","hi","him","himself","his","hither","hopefully","how","howbeit","however","i","i'd","i'll","i'm","i've","ie","if","ignored","immediate","in","inasmuch","inc","indeed","indicate","indicated","indicates","inner","insofar","instead","into","inward","is","isn't","it","it'd","it'll","it's","its","itself","j","just","k","keep","keeps","kept","know","known","knows","l","last","lately","later","latter","latterly","least","less","lest","let","let's","like","liked","likely","little","look","looking","looks","ltd","m","mainly","many","may","maybe","me","mean","meanwhile","merely","might","more","moreover","most","mostly","much","must","my","myself","n","name","namely","nd","near","nearly","necessary","need","needs","neither","never","nevertheless","new","next","nine","no","nobody","non","none","noone","nor","normally","not","nothing","novel","now","nowhere","o","obviously","of","off","often","oh","ok","okay","old","on","once","one","ones","only","onto","or","other","others","otherwise","ought","our","ours","ourselves","out","outside","over","overall","own","p","particular","particularly","per","perhaps","placed","please","plus","possible","presumably","probably","provides","q","que","quite","qv","r","rather","rd","re","really","reasonably","regarding","regardless","regards","relatively","respectively","right","s","said","same","saw","say","saying","says","second","secondly","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sensible","sent","serious","seriously","seven","several","shall","she","should","shouldn't","since","six","so","some","somebody","somehow","someone","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specified","specify","specifying","still","sub","such","sup","sure","t","t's","take","taken","tell","tends","th","than","thank","thanks","thanx","that","that's","thats","the","their","theirs","them","themselves","then","thence","there","there's","thereafter","thereby","therefore","therein","theres","thereupon","these","they","they'd","they'll","they're","they've","think","third","this","thorough","thoroughly","those","though","three","through","throughout","thru","thus","to","together","too","took","toward","towards","tried","tries","truly","try","trying","twice","two","u","un","under","unfortunately","unless","unlikely","until","unto","up","upon","us","use","used","useful","uses","using","usually","uucp","v","value","various","very","via","viz","vs","w","want","wants","was","wasn't","way","we","we'd","we'll","we're","we've","welcome","well","went","were","weren't","what","what's","whatever","when","whence","whenever","where","where's","whereafter","whereas","whereby","wherein","whereupon","wherever","whether","which","while","whither","who","who's","whoever","whole","whom","whose","why","will","willing","wish","with","within","without","won't","wonder","would","wouldn't","x","y","yes","yet","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves","z","zero"];
		
		var queryWords = query.split()

		var resultwords = queryWords.filter(word => {
			return stopwords.indexOf(word) == -1
		});

		return resultwords.join(" ");
	}
	extractTopics(elem){
		//Normalizing 
		//Removing stop words (e.g. "a", "the", "and", etc.)
		var text = elem.innerText; //this.removeStopWords(elem.innerText);
		return window.nlp(text).normalize().topics(); //.data
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
	createIframe(id) {
		
		var frame = document.createElement("iframe");
			frame.id = id;
			frame.style.margin = "0px";
			frame.style.border = "0px";
			frame.style.position = "absolute";
			frame.style.top = "0";
			frame.style.bottom = "0";
			frame.style.left = "0";
			frame.style.right = "0";
			frame.style.height = "100%";
			frame.style.width = "100%";
			frame.style.padding = "0px";

		return frame;
	};
}

var pageManager = new ContentPageManager();

//Listening for background's messages
browser.runtime.onMessage.addListener((request, sender) => {

	console.log("[content-side] calling the message: " + request.call);
	if(pageManager[request.call]){
		pageManager[request.call](request.args);
	}
});
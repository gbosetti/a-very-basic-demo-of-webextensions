class BackgroundExtension{

	highlightCurrentDom(){
		this.getCurrentTab().then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, {
				call: "highlightCurrentDom",
				args: {color: "orange"}
			});
		});
	}
	getCurrentTab(callback) {
		return browser.tabs.query({
			active: true,
			currentWindow: true
		});
	}
}

var extension = new BackgroundExtension();

browser.browserAction.onClicked.addListener(() => {
  extension.highlightCurrentDom();
});
document.addEventListener("DOMContentLoaded", function restoreOptions() {
    
  browser.storage.local.get("config").then(function setCurrentChoice(result) {
    document.querySelector("#api-url").value = result.config["apiUrl"];
  });

  document.querySelector("form").addEventListener("submit", function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
      "config": {
        "apiUrl": document.querySelector("#api-url").value
      }
    });
  });

});
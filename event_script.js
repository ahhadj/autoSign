
var tiebaList;
var userList;


var userIndex = 0;
var tiebaIndex = 0;
var opened = false;

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.local.get('userList', function (result) {
		userList = result.userList;
	});
	chrome.storage.local.get('tiebaList', function (result) {
		tiebaList = result.tiebaList;
	});
});

function openNextBaResponse() {
	return {"type" : "openNextTieBa",
	"url" : "https://tieba.baidu.com/f?ie=utf-8&kw=" + tiebaList[tiebaIndex].name};
}

function changeUserResponse() {
	return {"type" : "changeUser"};
}

function doneResponse() {
	return {"type" : "done"};
}


function loginInfoResponse() {
	return {"type" : "login",
			"user" : userList[userIndex]};
}
//Show Page-Action using the onMessage event
chrome.runtime.onMessage.addListener(function (requestMessage, sender, sendResponse) {
	console.log("requestMessage: " + requestMessage.data);
	if (requestMessage.type === "openNext") {
		if (!opened){
			chrome.pageAction.show(sender.tab.id);
			opened = true;
		}
		if (tiebaIndex == tiebaList.length) {
			tiebaIndex = 0;
			sendResponse(changeUserResponse());
		}else{
			sendResponse(openNextBaResponse());
			tiebaIndex++;
		}
	}else if (requestMessage.type === "login"){
		if (userIndex == userList.length){
			sendResponse(doneResponse());
		}else{
			sendResponse(loginInfoResponse());
		}
		userIndex++;
	}else if (requestMessage.type === "signSuccess"){
		sendResponse(openNextBaResponse());
	}
});
//end-region
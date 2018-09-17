
var interstedBarNames = ["混沌大学", "喜马拉雅", "樊登读书会", "刘润", "超级个体", "得到app"];
var userInfos = [{"name":"", "passwd":""},
{"name":"", "passwd":""}];

var userIndex = 0;
var tiebaIndex = 0;
var opened = false;

function openNextBaResponse() {
	return {"type" : "openNextTieBa",
	"url" : "https://tieba.baidu.com/f?ie=utf-8&kw=" + interstedBarNames[tiebaIndex]};
}

function changeUserResponse() {
	return {"type" : "changeUser"};
}

function doneResponse() {
	return {"type" : "done"};
}


function loginInfoResponse() {
	return {"type" : "login",
			"user" : userInfos[userIndex]};
}
//Show Page-Action using the onMessage event
chrome.runtime.onMessage.addListener(function (requestMessage, sender, sendResponse) {
	console.log("requestMessage: " + requestMessage.data);
	if (requestMessage.type === "openNext") {
		if (!opened){
			chrome.pageAction.show(sender.tab.id);
			opened = true;
		}
		if (tiebaIndex == interstedBarNames.length) {
			tiebaIndex = 0;
			sendResponse(changeUserResponse());
		}else{
			sendResponse(openNextBaResponse());
			tiebaIndex++;
		}
	}else if (requestMessage.type === "login"){
		if (userIndex == userInfos.length){
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
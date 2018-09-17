
var interstedBarNames = ["混沌大学", "喜马拉雅", "樊登读书会", "刘润", "超级个体", "得到app"];
var userInfos = [{ "name": "rxqn666", "passwd": "w(x8GY#(" },
{ "name": "a374427627", "passwd": "eL_s9x6t" },
{ "name": "zmjnpu", "passwd": "5\\Gf&5z5" },
{ "name": "fm8du1", "passwd": "NB{Pe/3t" },
{ "name": "sa6uu3", "passwd": "Y4sg)4su" }];

var userIndex = 0;
var tiebaIndex = 0;

function openNextBaResponse() {
	var response;
	tiebaIndex++;
	if (tiebaIndex === interstedBarNames.length) {
		tiebaIndex = 0;
		userIndex++;
		if (userIndex == userInfos.length) {
			response = {"type" : "done"};
		}else{
			response = {"type" : "changeUser"};
		}
	}else{
		response = {"type" : "changeTieBa",
					"url" : "https://tieba.baidu.com/f?ie=utf-8&kw=" + interstedBarNames[tiebaIndex]};
	}
}

function loginInfoResponse() {
	return {"type" : "userInfo",
			"user" : userInfos[userIndex]};
}

//region {calls}
console.log(consoleGreeting);
//Show Page-Action using the onMessage event
chrome.runtime.onMessage.addListener(function (requestMessage, sender, sendResponse) {
	console.log("requestMessage: " + requestMessage.data);
	if (requestMessage.type === "open") {
		chrome.pageAction.show(sender.tab.id);
		sendResponse(openNextBaResponse());
	}else if (requestMessage.type === "login"){
		sendResponse(loginInfoResponse());
	}else if (requestMessage.type === "signSuccess"){
		sendResponse(openNextBaResponse());
	}
});
//end-region
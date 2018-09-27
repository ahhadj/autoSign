var tiebaList;
var userList;
var signUserList;
var currentUser;
var isOn = false;


var userIndex = 0;
var tiebaIndex = 0;

function saveUserList() {
    chrome.storage.local.set({
        "userList": userList
    }, function () {
        console.log("user saved");
    });
}

chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.local.get('userList', function (result) {
		userList = result.userList;
		let currentDate = getCurrentDate();
		signUserList = userList.filter(user => {
			if (user.signedDate === currentDate) {
				return false;
			}
			return true;
		});
	});
	chrome.storage.local.get('tiebaList', function (result) {
		tiebaList = result.tiebaList;
	});
});

function getCurrentDate() {
	var dateObj = new Date();
	var month = dateObj.getMonth() + 1; //months from 1-12
	var day = dateObj.getDate();
	var year = dateObj.getFullYear();

	newdate = year + "/" + month + "/" + day;
	return newdate;
}

function updateUser() {
	currentUser.signedDate = getCurrentDate();
	saveUserList();
}

function openNextBaResponse() {
	return {
		"type": "openNextTieBa",
		"url": "https://tieba.baidu.com/f?ie=utf-8&kw=" + tiebaList[tiebaIndex].name
	};
}

function changeUserResponse() {
	return {
		"type": "changeUser"
	};
}

function doneResponse() {
	return {
		"type": "done"
	};
}


function loginInfoResponse() {
	return {
		"type": "login",
		"user": currentUser
	};
}
//Show Page-Action using the onMessage event
chrome.runtime.onMessage.addListener(function (requestMessage, sender, sendResponse) {
	console.log("requestMessage: " + requestMessage.data);
	if (requestMessage.type === 'switchOnOff') {
		isOn = !isOn;
		sendResponse({type: "switch", isOn: isOn});
	}
	if (!isOn) {
		return;
	}
	if (requestMessage.type === "openNext") {
		if (tiebaIndex == tiebaList.length) {
			tiebaIndex = 0;
			sendResponse(changeUserResponse());
			updateUser();
		} else {
			sendResponse(openNextBaResponse());
			tiebaIndex++;
		}
	} else if (requestMessage.type === "login") {
		if (userIndex == signUserList.length) {
			sendResponse(doneResponse());
		} else {
			currentUser = signUserList[userIndex];
			sendResponse(loginInfoResponse());
		}
		userIndex++;
	} else if (requestMessage.type === "signSuccess") {
		sendResponse(openNextBaResponse());
	}
});
//end-region
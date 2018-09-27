var userList;
var switchBtn;

function onLoad(f) {
	if (onLoad.loaded) {
		window.setTimeout(f, 0);
	}else if (window.addEventListener) {
		window.addEventListener('load', f, false);
	}
};

onLoad.loaded = false;
onLoad(function() {onLoad.loaded = true;});

function getCurrentDate() {
	var dateObj = new Date();
	var month = dateObj.getMonth() + 1; //months from 1-12
	var day = dateObj.getDate();
	var year = dateObj.getFullYear();

	newdate = year + "/" + month + "/" + day;
	return newdate;
}

function readUserList() {
    chrome.storage.local.get('userList', function (result) {
        userList = result.userList;

        let userUL = document.getElementById('signList');
        let currentDate = getCurrentDate(); 
        userList.forEach(user => {
            var li = document.createElement('li');
            li.textContent = user.name;
            var signedCheck = document.createElement('input');
            signedCheck.type = "checkbox";
            signedCheck.addEventListener('click', function(){
                updateUser(user.name, signedCheck.checked);
            });
            li.appendChild(signedCheck);
            userUL.appendChild(li);
            if (user.signedDate === currentDate) {
                signedCheck.checked = true;
            }
        });
    });
}

function updateUser(name, signed) {
    userList.forEach(user => {
        if (user.name === name) {
            if (signed) {
                user.signedDate = getCurrentDate();
            }else{
                user.signedDate = null;
            }
        }
    });
    saveUserList();
}

function saveUserList() {
    chrome.storage.local.set({
        "userList": userList
    }, function () {
        console.log("user saved");
    });
}

onLoad(readUserList);

function onOffSwitch() {
    switchBtn = document.getElementById('onOffSwitch');
    switchBtn.addEventListener('click', function() {
        chrome.runtime.sendMessage({'type':'switchOnOff'}, handleResponse);
    });
}

onLoad(onOffSwitch);

function handleResponse(responseObj) {
    if (responseObj.type === 'switch') {
        if (!responseObj.isOn) {
            switchBtn.textContent = "开启";
        }else{
            switchBtn.textContent = "停止";
        }
    }
}

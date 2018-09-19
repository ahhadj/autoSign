var userList;

function onLoad(f) {
	if (onLoad.loaded) {
		window.setTimeout(f, 0);
	}else if (window.addEventListener) {
		window.addEventListener('load', f, false);
	}
};

onLoad.loaded = false;
onLoad(function() {onLoad.loaded = true;});

function readUserList() {
    chrome.storage.local.get('userList', function (result) {
        userList = result.userList;

        var userUL = document.getElementById('signList');

        userList.forEach(user => {
            var li = document.createElement('li');
            li.textContent = user.name;
            var progressBar = document.createElement('progress');
            li.appendChild(progressBar);

            userUL.appendChild(li);
        });
    });
}

onLoad(readUserList);


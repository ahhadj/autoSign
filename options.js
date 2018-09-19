function onLoad(f) {
    if (onLoad.loaded) {
        window.setTimeout(f, 0);
    } else if (window.addEventListener) {
        window.addEventListener('load', f, false);
    }
};

var userList;
var tiebaList;
var batchMode = false;

onLoad.loaded = false;
onLoad(function () {
    onLoad.loaded = true;
});

onLoad(function () {
    let addUserBtn = document.getElementById('addUserButton');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', onAddUser);
    }
    let addTieBaBtn = document.getElementById('addBaBottun');
    if (addTieBaBtn) {
        addTieBaBtn.addEventListener('click', onAddTieBa);
    }
    let modeChangeBtn = document.getElementById('modeSwitch');
    if (modeChangeBtn) {
        modeChangeBtn.addEventListener('click', function () {
            batchMode = !batchMode;
            toggleBatchMode();
        });
    }
    let userBatchAddBtn = document.getElementById('batchAddUser');
    if (userBatchAddBtn) {
        userBatchAddBtn.addEventListener('click', batchAddUser);
    }

    let tiebaBatchAddBtn = document.getElementById('batchAddTieba');
    if (tiebaBatchAddBtn) {
        tiebaBatchAddBtn.addEventListener('click', batchAddTieba);
    }

    toggleBatchMode();
    readUserList();
    readTiebaList();
});

function toggleBatchMode() {
    let modeChangeBtn = document.getElementById('modeSwitch');
    let userInput = document.getElementById('userInput');
    let userBatchInput = document.getElementById('userPatchInput');
    let tiebaInput = document.getElementById('tiebaInput');
    let tiebaBatchInput = document.getElementById('tiebaBatchInput');
    if (batchMode) {
        modeChangeBtn.text = "单条输入";
        userInput.style.visibility = 'hidden';
        tiebaInput.style.visibility = 'hidden';
        userBatchInput.style.visibility = 'visible';
        tiebaBatchInput.style.visibility = 'visible';
    }else{
        modeChangeBtn.text = "批量输入";
        userInput.style.visibility = 'visible';
        tiebaInput.style.visibility = 'visible';
        userBatchInput.style.visibility = 'hidden';
        tiebaBatchInput.style.visibility = 'hidden';
    }
}

function readUserList() {
    chrome.storage.local.get('userList', function (result) {
        userList = result.userList;
        if (userList) {
            userList.forEach(function (user, index) {
                insertDisplayItem(user.name, index, "user");
            });
        }
    });
}

function readTiebaList() {
    chrome.storage.local.get('tiebaList', function (result) {
        tiebaList = result.tiebaList;
        if (tiebaList) {
            tiebaList.forEach(function (tieba, index) {
                insertDisplayItem(tieba.name, index, 'tieba');
            });
        }
    });
}



function createUser(name, passwd) {
    return {
        name,
        passwd
    };
}

function createTieba(name) {
    return {
        name
    }
}

function createElement(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    return el;
}

function batchAddUser() {
    let infosInput = document.getElementById('userInfosInput');
    let infosText = infosInput.value;
    if (infosText) {
        let infos = infosText.split('\n');
        infos = infos.filter(string => string);
        infos.forEach(function(item) {
            let words = item.split(' ').filter(w => w);
            addOneUser(words[0], words[1]);
        });
        saveUserList();
    }

    infosInput.value = "";
}

function addOneUser(userName, passwd) {
    let userIndex = -1;
    let newUser = false;
    console.log(userName + "   " + passwd);
    if (!Array.isArray(userList)) {
        userList = [createUser(userName, passwd)];
        userIndex = 0;
        newUser = true;
    } else {
        userList.forEach(function (user, index) {
            if (user.name === userName) {
                user.passwd = passwd;
                userIndex = index;
            }
        });

        if (userIndex < 0) {
            userIndex = userList.length;
            userList.push(createUser(userName, passwd));
            newUser = true;
        }
    }

    if (newUser) {
        insertDisplayItem(userName, userIndex, "user");;
    }
}

function onAddUser() {
    let userInput = document.getElementById('userNameInput');
    let passwdInput = document.getElementById('userPassWdInput');
    let userName = userInput.value;
    let passwd = passwdInput.value;
    if (userName && passwd) {
        addOneUser(userName, passwd);
        saveUserList();
        userInput.value = "";
        passwdInput.value = "";
    }
}

function batchAddTieba() {
    let tiebaBatchInput = document.getElementById('tiebaInfosInput');
    let tiebaInfos = tiebaBatchInput.value;

    if (tiebaInfos) {
        let infos = tiebaInfos.split('\n').filter(s => s);
        infos.forEach(function(name) {
            let n = name.split(' ').filter(s => s);
            addOneTieba(n[0]);
        });
        saveTiebaList();
    }
    tiebaBatchInput.value = "";
}

function addOneTieba(tiebaName) {
    let tiebaIndex = -1;
    let newTieba = false;
    if (!Array.isArray(tiebaList)) {
        tiebaList = [createTieba(tiebaName)];
        newTieba = true;
    } else {
        tiebaList.forEach(function (tieba, index) {
            if (tiebaName === tieba.name) {
                tiebaIndex = index;
            }
        });
        if (tiebaIndex < 0) {
            tiebaIndex = tiebaList.length;
            tiebaList.push(createTieba(tiebaName));
            newTieba = true;
        }
    }
    if (newTieba) {
        insertDisplayItem(tiebaName, tiebaIndex, 'tieba');
    }
}

function onAddTieBa() {
    let tiebaInput = document.getElementById('TieBaNameInput');
    let tiebaName = tiebaInput.value;
    if (tiebaName) {

        saveTiebaList();
        tiebaInput.value = "";
    }
}

function saveTiebaList() {
    chrome.storage.local.set({
        'tiebaList': tiebaList
    }, function () {
        console.log('tieba saved');
    });
}

function saveUserList() {
    chrome.storage.local.set({
        "userList": userList
    }, function () {
        console.log("user saved");
    });
}

function deleteItem(e) {
    let button = e.target;
    let tag = button.id.split("#")[0];
    let deletedItem = button.parentElement;
    if (tag === "user") {
        // userList.splice(itemIndex, 1);
        userList = userList.filter(user => user.name !== deletedItem.firstChild.textContent);
        saveUserList();
    } else if (tag === 'tieba') {
        // tiebaList.splice(itemIndex, 1);
        tiebaList = tiebaList.filter(tieba => tieba.name !== deletedItem.firstChild.textContent);
        saveTiebaList();
    }
    let userListElement = document.getElementById(tag + "List");
    userListElement.removeChild(deletedItem);
}

function insertDisplayItem(itemName, index, tag) {
    let listElement = document.getElementById(tag + "List");
    const newUser = createElement('li', itemName);
    const deleteButton = createElement('button', "删除");

    deleteButton.id = tag + "#" + index;
    deleteButton.type = "button";
    deleteButton.addEventListener('click', deleteItem);
    newUser.appendChild(deleteButton);
    let inputItem = document.getElementById(tag + "Input");
    listElement.insertBefore(newUser, inputItem);
}
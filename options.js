function onLoad(f) {
    if (onLoad.loaded) {
        window.setTimeout(f, 0);
    } else if (window.addEventListener) {
        window.addEventListener('load', f, false);
    }
};

var userList;
var tiebaList;

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
    readUserList();
    readTiebaList();
});

function readUserList() {
    chrome.storage.local.get('userList', function (result) {
        userList = result.userList;
        if (userList) {
            userList.forEach(function (user, index) {
                displayItem(user.name, index, "user");
            });
        }
    });
}

function readTiebaList() {
    chrome.storage.local.get('tiebaList', function (result) {
        tiebaList = result.tiebaList;
        if (tiebaList) {
            tiebaList.forEach(function (tieba, index) {
                displayItem(tieba.name, index, 'tieba');
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

function onAddUser() {
    let userInput = document.getElementById('userNameInput');
    let passwdInput = document.getElementById('userPassWdInput');
    let userName = userInput.value;
    let passwd = passwdInput.value;
    let userIndex = -1;
    if (userName && passwd) {
        console.log(userName + "   " + passwd);
        if (!Array.isArray(userList)) {
            userList = [createUser(userName, passwd)];
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
            }
        }

        displayItem(userName, userIndex, "user");
        saveUserList();
        userInput.value = "";
        passwdInput.value = "";
    }
}

function onAddTieBa() {
    let tiebaInput = document.getElementById('TieBaNameInput');
    let tiebaName = tiebaInput.value;
    let tiebaIndex = -1;
    if (tiebaName) {
        if (!Array.isArray(tiebaList)) {
            tiebaList = [createTieba(tiebaName)];
        } else {
            tiebaList.forEach(function (tieba, index) {
                if (tiebaName === tieba.name) {
                    tiebaIndex = index;
                }
            });
            if (tiebaIndex < 0) {
                tiebaIndex = tiebaList.length;
                tiebaList.push(createTieba(tiebaName));
            }
        }

        displayItem(tiebaName, tiebaIndex, 'tieba');
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

function displayItem(itemName, index, tag) {
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
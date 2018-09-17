function onLoad(f) {
	if (onLoad.loaded) {
		window.setTimeout(f, 0);
	}else if (window.addEventListener) {
		window.addEventListener('load', f, false);
	}
};

onLoad.loaded = false;
onLoad(function() {onLoad.loaded = true;});

function checkSigned() {
	var signBtn = document.getElementById('signstar_wrapper');
	if (!signBtn && signBtn.classList.contains('sign_box_bright_signed')){
		return true;
	}else{
		return false;
	}
}

function clickSignBtn() {
	var signBtn = document.getElementById('signstar_wrapper');
	if (!checkSigned()){
		signBtn.firstElementChild.click();
		window.setTimeout(checkSignStatus, 1000);
	}
}

function changeToUserLogin() {
	var userLoginBtn = document.getElementsByClassName('tang-pass-footerBarULogin pass-link').item(0);
	userLoginBtn.click();
	window.setTimeout(loginUser("a374427627", "eL_s9x6t"), 1000);
}



function checkSignStatus() {
	var signDiv = document.getElementById('TANGRAM__PSP_6__');
	if (signDiv) {
		changeToUserLogin();
	}else{
		clickSignBtn();
	}
}

function loginUser(name, passwd) {
	var nameInput = document.getElementById('TANGRAM__PSP_11__userName');
	nameInput.value = name;
	var passwdInput = document.getElementById('TANGRAM__PSP_11__password')
	passwdInput.value = passwd;
	var loginBtn = document.getElementById('TANGRAM__PSP_11__submit');
	loginBtn.click();
}
onLoad(function() {
	clickSignBtn();
});

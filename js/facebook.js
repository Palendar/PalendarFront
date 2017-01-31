// initialize and setup facebook js sdk
window.fbAsyncInit = function() {
	FB.init({
	  appId      : '314613362246661',
	  xfbml      : true,
	  version    : 'v2.8'
	});

	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			var link = window.location.href;
			var res = link.split("/");
			if(res[res.length-1] == 'login.html' || res[res.length-1] == 'login') {
				//getHome();
			}
		} else if (response.status === 'not_authorized') {
			//document.getElementById('status').innerHTML = 'We are not logged in.'
		} else {
			//document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
		}
	});
};

//connect with fb
function connectFb() {
	FB.api('/me', 'GET', {fields: 'first_name,last_name,name,email,id,picture.width(150).height(150)'}, function(response) {
		$.post('http://vinci.aero/palendar/php/user/loginFacebook.php', {facebook:response.id}, function(data, status) {
			if (status === "success") {
				if(data.validate) {
					getHome();
				} else {
					$.post('http://vinci.aero/palendar/php/user/registerFacebook.php', {email:response.email, facebook:response.id, firstname:response.first_name, lastname:response.last_name}, function(data, status) {
						if (status === "success") {
							console.log("userfb created");
							getHome();
						}
					}, "json");
				}
			}
		}, "json");
	});
}

// login with facebook with extra permissions
function getHome() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'home');
  window.location.href = newlink;
}


// button login fb
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v2.8&appId=314613362246661";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

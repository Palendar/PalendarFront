
// initialize and setup facebook js sdk
window.fbAsyncInit = function() {
	FB.init({
	  appId      : '314613362246661',
	  xfbml      : true,
	  version    : 'v2.8'
	});

	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			//window.location.href="http://localhost/PalendarFront/home.html";
			//document.getElementById('status').innerHTML = 'We are connected.';
			//document.getElementsByClassName('loginform').style.display = 'none';
		} else if (response.status === 'not_authorized') {
			//document.getElementById('status').innerHTML = 'We are not logged in.'
		} else {
			//document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
		}
	});
};

// login with facebook with extra permissions
/*function login() {
	FB.login(function(response) {
		if (response.status === 'connected') {
			window.location.href="http://localhost/PalendarFront/home.html";
			document.getElementById('status').innerHTML = 'We are connected.';
			document.getElementById('login').style.visibility = 'hidden';
		} else if (response.status === 'not_authorized') {
			document.getElementById('status').innerHTML = 'We are not logged in.'
		} else {
			console.log('test');
			document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
		}
	}, {scope: 'email'});
}*/

// getting basic user info
function getInfo() {
	FB.api('/me', 'GET', {fields: 'first_name,last_name,name,email,id,picture.width(150).height(150)'}, function(response) {
		document.getElementById('status').innerHTML = response.email + response.id + '<br>' + response.first_name + '<br>' + response.last_name;
		document.getElementById('status').innerHTML = document.getElementById('status').innerHTML + "<img src='" + response.picture.data.url + "'>";
	});
}

// button login fb
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v2.8&appId=314613362246661";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

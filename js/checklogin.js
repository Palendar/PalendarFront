function returnLoginPage() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'login');
  window.location.href = newlink;
}

function getHome() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'home');
  window.location.href = newlink;
}

$(document).ready(function() {
  var url = 'http://vinci.aero/palendar/php/user/checkLogin.php';
  $.getJSON(url, function (data, status) {
    if (status === "success") {
      if(!data.validate) {
        if(!($(location).attr('href') === "http://vinci.aero/palendar/views/login") && !($(location).attr('href') === "http://vinci.aero/palendar/views/login.html")) {
          returnLoginPage();
        }
      } else {
        if($(location).attr('href') === "http://vinci.aero/palendar/views/login" || $(location).attr('href') === "http://vinci.aero/palendar/views/login.html") {
          getHome();
        }
      }
    }
  });
});

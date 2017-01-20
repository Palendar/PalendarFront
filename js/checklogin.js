function returnLoginPage() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'login');
  window.location.href = newlink;
}

$(document).ready(function() {
  var url = 'http://vinci.aero/palendar/php/checkLogin.php';
  $.getJSON(url, function (data, status) {
    if (status === "success") {
      if(!data.validate) {
        returnLoginPage();
      }
    }
  });
});

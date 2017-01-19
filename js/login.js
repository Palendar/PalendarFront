function getHome() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'home');
  window.location.href = newlink;
}

$(window).on('load', function () {

  $(".login-form").submit(function(event) {
    var email = $(this).closest('form').find('input').eq(0).val();
    var password = $(this).closest('form').find('input').eq(1).val();

    var loginPostUrl = 'http://vinci.aero/palendar/php/login.php';
    $.post(loginPostUrl, {email: email, password: password}, function(data, status) {
      if (status === "success") {
        var loginOK = data.validate;
        if(loginOK) {
          getHome();
        } else {
          $(".errorloginpassword").show();
          $(".login-form").closest('form').find('input').eq(1).val("");
        }
      }
    }, "json");
    event.preventDefault();
  });

});

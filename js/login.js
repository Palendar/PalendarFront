function getHome() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'home');
  window.location.href = newlink;
}

$(window).on('load', function () {

  $('.message a').click(function(){
     $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  });

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

  $(".register-form").submit(function(event) {
    var fn = $(this).closest('form').find('input').eq(0).val();
    var ln = $(this).closest('form').find('input').eq(1).val();
    var email = $(this).closest('form').find('input').eq(2).val();
    var password = $(this).closest('form').find('input').eq(3).val();

    console.log(fn +' ' + ln + ' '+ email + ' ' + password);

    var checkEmailUrl = 'http://vinci.aero/palendar/php/checkEmail.php';
    var registerUrl = 'http://vinci.aero/palendar/php/register.php';
    $.post(checkEmailUrl, {email: email}, function(data, status) {
      if (status === "success") {
        var emailOK = data.validate;
        console.log("checkemail :" + emailOK);
        if(emailOK) {
          $.post(registerUrl, {firstname: fn, lastname: ln, email: email, password: password}, function(data, status) {
            if (status === "success") {
              var registerOk = data.validate;
              if(registerOk) {
                console.log("ok");
              } else {
                //error message email
              }
            }
          }, "json");
        } else {
          //error message email
        }
      }
    }, "json");
    event.preventDefault();
  });

});

function getHome() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'home');
  window.location.href = newlink;
}

function clearAllInput() {
  $(".login-form").closest('form').find('input').eq(0).val("");
  $(".login-form").closest('form').find('input').eq(1).val("");

  $(".register-form").closest('form').find('input').eq(0).val("");
  $(".register-form").closest('form').find('input').eq(1).val("");
  $(".register-form").closest('form').find('input').eq(2).val("");
  $(".register-form").closest('form').find('input').eq(3).val("");
  $(".register-form").closest('form').find('input').eq(4).val("");
}

function validatePassword(){
  $(".register-form").closest('form').find('input').eq(4).blur(function() {
    $(this).css("box-shadow","");
  });
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords don't match");
    $(".register-form").closest('form').find('input').eq(4).focus(function() {
      $(this).css("box-shadow","0px 0px 4px red");
    });
  } else {
    confirm_password.setCustomValidity('');
    $(".register-form").closest('form').find('input').eq(4).focus(function() {
      $(this).css("box-shadow","0px 0px 4px #37ABEA");
    });
  }
  $(".register-form").closest('form').find('input').eq(4).blur(function() {
    $(this).css("box-shadow","");
  });
}

$(window).on('load', function () {

  var password = document.getElementById("password");
  var confirm_password = document.getElementById("confirm_password");

  password.onchange = validatePassword;
  confirm_password.onkeyup = validatePassword;

  $('.message a').click(function(){
    $(".errorloginpassword").hide();
    clearAllInput();
    $(".erroremail").hide();
    $(".register-form").closest('form').find('input').eq(2).css("box-shadow","");
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  });

  $(".login-form").submit(function(event) {
    var email = $(this).closest('form').find('input').eq(0).val();
    var password = $(this).closest('form').find('input').eq(1).val();

    var loginPostUrl = 'http://vinci.aero/palendar/php/user/login.php';
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
    $(".erroremail").hide();
    $(".register-form").closest('form').find('input').eq(2).css("box-shadow","");

    var fn = $(this).closest('form').find('input').eq(0).val();
    var ln = $(this).closest('form').find('input').eq(1).val();
    var email = $(this).closest('form').find('input').eq(2).val();
    var password = $(this).closest('form').find('input').eq(3).val();

    console.log(fn +' ' + ln + ' '+ email + ' ' + password);

    var checkEmailUrl = 'http://vinci.aero/palendar/php/user/checkEmail.php';
    var registerUrl = 'http://vinci.aero/palendar/php/user/register.php';
    $.post(checkEmailUrl, {email: email}, function(data, status) {
      if (status === "success") {
        var emailOK = data.validate;
        console.log("checkemail :" + emailOK);
        if(emailOK) {
          $.post(registerUrl, {firstname: fn, lastname: ln, email: email, password: password}, function(data, status) {
            if (status === "success") {
              var registerOk = data.validate;
              if(registerOk) {
                alert('You have successfully created your Palendar Account');
                location.reload();
              } else {
                //error message email
              }
            }
          }, "json");
        } else {
          $(".erroremail").show();
          $(".register-form").closest('form').find('input').eq(2).css("box-shadow","0px 0px 4px red");
          $(".register-form").closest('form').find('input').eq(3).val("");
          $(".register-form").closest('form').find('input').eq(4).val("");
        }
      }
    }, "json");
    event.preventDefault();
  });

});

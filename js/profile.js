$(window).on('load', function () {

  //update page profile user (search)
  var current = $(location).attr('href');
  var tabcurrent = current.split('=');
  var idprofile = tabcurrent[tabcurrent.length-1];
  $.post('http://vinci.aero/palendar/php/contact/getUser.php', {id:idprofile}, function(data, status) {
    if (status === "success") {
        $("#fistnamelastname").text(data.firstname + ' ' + data.lastname);
    }
  }, "json");
});

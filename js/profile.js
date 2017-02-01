$(window).on('load', function () {

  //update page profile user (search)
  var current = $(location).attr('href');
  var tabcurrent = current.split('=');
  var idprofile = tabcurrent[tabcurrent.length-1];
  $.post('http://vinci.aero/palendar/php/contact/getUser.php', {id:idprofile}, function(data, status) {
    if (status === "success") {
      if(data.image === '') {
        $('.infoUser').prepend("<img class='imagegroup addmargintop' src='../upload/user/default.jpeg'>");
        $("#fistnamelastname").text(data.firstname + ' ' + data.lastname);
      } else {
        $('.infoUser').prepend("<img class='imagegroup addmargintop' src='../upload/user/" + data.image + "'>");
        $("#fistnamelastname").text(data.firstname + ' ' + data.lastname);
      }
    }
  }, "json");
});

$(window).on('load', function () {
  var idgroupselect = window.location.search.substr(1).split("=")[1];
  $("#sendmsg").click(function() {
    var message = $("#msg").val();
    console.log(message);
    $.post('http://vinci.aero/palendar/php/group/sendGroupMessage.php', {message:message, id_group:idgroupselect}, function(data, status) {
      if (status === "success") {
      }
    }, "json");
    location.reload();
  });

  var idgroup = window.location.search.substr(1).split("=")[1];
  $.post('http://vinci.aero/palendar/php/group/getAllGroupMessage.php', {id_group:idgroup}, function(data, status) {
    if (status === "success") {
      $("#chatZone").html('');
      $.each(data, function(index, val) {
        $("#chatZone").append("<div class='onemessage'>" +
						"<p class='user'>" + val.firstname + ' ' + val.lastname + "</p>" + "<p class='stylemsg'>" + val.message + "</p>" +
            "<p class='date'>" + val.created + "</p>"+ "</div>");
      });
    }
  }, "json");

});

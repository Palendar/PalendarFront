$(window).on('load', function () {
  $("#messageform").submit(function() {
    var message = $("#msg").val();
    console.log(message);
    $.post('http://vinci.aero/palendar/php/group/sendGroupMessage.php', {message:message, id_group:'18'}, function(data, status) {
      if (status === "success") {
      }
    }, "json");
  });

  $.post('http://vinci.aero/palendar/php/group/getAllGroupMessage.php', {id_group:'18'}, function(data, status) {
    if (status === "success") {
      $.each(data, function(index, val) {
        $("#chatZone").append("<div class='onemessage'>" +
						"<div class='user'>" + val.firstname + ' ' + val.lastname + "</div>" + "<div class='stylemsg'>" + val.message + "</div>" +
            "<div class='date'>" + val.created + "</div>"+ "</div>");
      });
    }
  }, "json");

});

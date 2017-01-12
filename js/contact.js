$(document).ready(function() {
  //Get JSON listfriends page contact
  var url1 = 'http://vinci.aero/palendar/php/test.php';
  $.getJSON(url1, function (data, v) {
    if (status === "success") {
      $.each(data, function(index, val) {
        $("#myfriends table tbody").append("<tr>" +
						"<td>" + val.pseudo + "</td></tr>");
      });
    }
  });

  //Get JSON listgroups page contact
  var url2 = 'http://vinci.aero/palendar/php/test.php';
  $.getJSON(url2, function (data, status) {
    if (status === "success") {
      $.each(data, function(index, val) {
        $("#mygroups table tbody").append("<tr>" +
            "<td>" + val.pseudo + "</td></tr>");
      });
    }
  });
});

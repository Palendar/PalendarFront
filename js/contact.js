function getNumberFriendsGroups() {
  var tabgroups = $('.tabgroups a').text();
  var numbergroups = $('#mygroups table tbody tr').length;
  $('.tabgroups a').text(tabgroups + ' (' + numbergroups +')');

  var tabfriends = $('.tabfriends a').text();
  var numberfriends = $('#myfriends table tbody tr').length;
  $('.tabfriends a').text(tabfriends + ' (' + numberfriends +')');
}

$(document).ready(function() {
  //Get JSON listfriends page contact
  var url1 = 'http://vinci.aero/palendar/php/contact/getAllContact.php';
  $.getJSON(url1, function (data, status) {
    if (status === "success") {
      $.each(data, function(index, val) {
        $("#myfriends table tbody").append("<tr>" +
						"<td>" + val.firstname + ' ' + val.lastname + "</td></tr>");
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
      getNumberFriendsGroups();
    }
  });
});

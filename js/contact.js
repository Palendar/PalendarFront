function getNumberFriends() {
  var tabfriends = $('.tabfriends a').text();
  var numberfriends = $('#myfriends table tbody tr').length;
  $('.tabfriends a').text(tabfriends + ' (' + numberfriends +')');
}

function getNumberGroups() {
  var tabgroups = $('.tabgroups a').text();
  var numbergroups = $('#mygroups table tbody tr').length;
  $('.tabgroups a').text(tabgroups + ' (' + numbergroups +')');
}

$(document).ready(function() {
  //Get JSON listfriends page contact
  var url1 = 'http://vinci.aero/palendar/php/contact/getAllContact.php';
  $.getJSON(url1, function (data, status) {
    if (status === "success") {
      $.each(data, function(index, val) {
        if(val.image === '' || val.image === null) {
          $("#myfriends table tbody").append("<tr>" +
              "<td>" + "<img class='imagegroup' src='../upload/user/default.jpeg'>" + val.firstname + ' ' + val.lastname + "</td>" +
              "<td class='idprofilefriend' style='display:none;'>" + val.id+ "</td>"+ "</tr>");
        } else {
          $("#myfriends table tbody").append("<tr>" +
              "<td>" + "<img class='imagegroup' src='../upload/user/" + val.image + "'>" + val.firstname + ' ' + val.lastname + "</td>" +
              "<td class='idprofilefriend' style='display:none;'>" + val.id+ "</td>"+ "</tr>");
        }
      });
      getNumberFriends();
    }
  });

  //click friend profile
  $("#myfriends table").on("click", "tr", function() {
    var idprofile = $(this).find(".idprofilefriend").text();
    getProfile("?id="+idprofile);
  });


  //Get JSON listgroups page contact
  var url2 = 'http://vinci.aero/palendar/php/group/getAllGroup.php';
  $.getJSON(url2, function (data, status) {
    if (status === "success") {
      $.each(data, function(index, val) {
        $("#mygroups table tbody").append("<tr>" +
						"<td>" + "<img class='imagegroup' src='../upload/group/" + val.image + "'>" + "<h2>" + val.name + "</h2>" + ' ' + "<p>" + val.description + "</p>" + "</td>" +
            "<td class='idprofilegroup' style='display:none;'>" + val.id+ "</td>"+ "</tr>");
      });
      getNumberGroups();
    }
  });

  //click group profile
  $("#mygroups table").on("click", "tr", function() {
    var idprofilegroup = $(this).find(".idprofilegroup").text();
    getGroup("?id="+idprofilegroup);
  });
});

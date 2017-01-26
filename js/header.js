function getHome() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'home');
  window.location.href = newlink;
}

function getContact() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'contact');
  window.location.href = newlink;
}

function getProfile(id) {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'profile');
  window.location.href = newlink + id;
}

function returnIdProfile(id) {
  return id;
}

function logout() {
  $.post('http://vinci.aero/palendar/php/logout.php', function(data, status) {
    if (status === "success") {
        location.reload();
    }
  });
}

$(window).on('load', function () {
  //searchbar & result search init
  $(document).click(function() {
    $("#search").val('');
    $(".resultsSearch").hide();
  });


  $('.settings-item').click(function () {
    $('#' + this.dataset.id).toggle();
  });

  $("#search").keyup(function() {
    var input = $("#search").val();
    if (input.trim() != ""){
      $(".resultsSearch").show();
      $.post('http://vinci.aero/palendar/php/search.php', {search:input}, function(data, status) {
        if (status === "success") {
          $(".resultsSearch table tbody").html('');
          $.each(data, function(index, val) {
            $(".resultsSearch table tbody").append("<tr>" +
                "<td>" + val.firstname + ' ' + val.lastname + "</td>"+
                "<td class='idprofile' style='display:none;'>" + val.id+ "</td>"+
                "</tr>");
          });
        }
      }, "json");
    } else {
      $(".resultsSearch").hide();
    }
  });

  //click search profile
  $(".resultsSearch table").on("click", "tr", function() {
    var idprofile = $(this).find(".idprofile").text();
    console.log(idprofile);
    getProfile("?id="+idprofile);
  });


  //add Friend
  $("#addInvitFriend").click(function() {
    var current = $(location).attr('href');
    var tabcurrent = current.split('=');
    var idprofile = tabcurrent[tabcurrent.length-1];
    console.log(idprofile);
    $.post('http://vinci.aero/palendar/php/addUser.php', {id:idprofile}, function(data, status) {
      if (status === "success") {
        //namedbb = data.name;
        console.log(data);
        alert("Invitation sent !");
      }
    }, "json");
  });

  //getUserInfo in settings
  $.getJSON('http://vinci.aero/palendar/php/getUser.php', function (data, status) {
    if (status === "success") {
      $("#settings-accsettings-profile-fn").val(data.firstname);
      $("#settings-accsettings-profile-ln").val(data.lastname);
      $("#settings-accsettings-profile-mail").val(data.email);
    }
  });

  //add Ical
  $("#addCalendar").click(function(event) {
    var nameCal = $("#inputCalendarName").val();
    var urlCal = $("#inputCalendarUrl").val();
    var namedbb, iddbb;
    if(nameCal === '' || urlCal === '') {
      return;
    }
    $.post('http://vinci.aero/palendar/php/createIcal.php', {name:nameCal, url:urlCal}, function(data, status) {
      if (status === "success") {
        //namedbb = data.name;
        console.log(data);
      }
    }, "json");
    $(".tabAllCalendar > tbody").prepend("<tr><td>" + nameCal +"</td>" +
    									"<td>" +
    										"<input type='color' class='colorpicker-perso'>" +
    									"</td>" +
                      "<td>" +
                        "<span><i class='fa fa-times' aria-hidden='true'></i></span>" +
                      "</td>"+
    								"</tr>");
    $("#inputCalendarName").val("");
    $("#inputCalendarUrl").val("");
    event.preventDefault();
  });

  //get All Ical in settings-item
  $.getJSON('http://vinci.aero/palendar/php/getAllIcal.php', function (data, status) {
    if (status === "success") {
      $.each(data, function(index, val) {
        $(".tabAllCalendar > tbody").prepend("<tr><td>" + val.name +"</td>" +
                          "<td>" +
                            "<input type='color' class='colorpicker-perso'>" +
                          "</td>" +
                          "<td>" +
                            "<span><i class='fa fa-times' aria-hidden='true'></i></span>" +
                          "</td>"+
                          "<td class='idcalendar' style='display:none'>" +
                            val.id +
                          "</td>"+
                        "</tr>");
      });
    }
  });

});

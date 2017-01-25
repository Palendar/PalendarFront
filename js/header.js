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
          console.log(data);
          $(".resultsSearch table tbody").html('');
          $.each(data, function(index, val) {
            $(".resultsSearch table tbody").append("<tr>" +
                "<td>" + val.firstname + ' ' + val.lastname + "</td></tr>");
          });
        }
      }, "json");
    } else {
      $(".resultsSearch").hide();
    }
  });

  //add Ical
  $("#addCalendar").click(function() {
    var nameCal = $("#inputCalendarName").val();
    var urlCal = $("#inputCalendarUrl").val();
    if(nameCal === '' || urlCal === '') {
      return;
    }
    $.post('http://vinci.aero/palendar/php/addIcal.php', {name:nameCal, url:urlCal}, function(data, status) {
      if (status === "success") {
        namedbb = data.name;
      }
    }, "json");
    $(".tabAllCalendar > tbody").prepend("<td>" + nameCal +"</td>" +
    									"<td>" +
    										"<input type='color' class='colorpicker-perso'>" +
    									"</td>" +
    									"<td>" +
    										"<span><i class='fa fa-times' aria-hidden='true'></i></span>" +
    									"</td>"+
    								"</tr>");

  });

});

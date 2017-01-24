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
          $(".resultsSearch table tbody").html('');
          $.each(data, function(index, val) {
            $(".resultsSearch table tbody").append("<tr>" +
                "<td>" + val.pseudo + "</td></tr>");
          });
        }
      }, "json");
    } else {
      $(".resultsSearch").hide();
    }
  });

});

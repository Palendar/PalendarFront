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

$(document).ready(function () {
  //searchbar & result search init
  $(document).click(function() {
    $(".search-form .form-group").css('width', '');
    $(".search-form .form-group").css('border-radius', '');
    $("#search").val('');
    $(".resultsSearch").hide();
  });


  $('.settings-item').click(function () {
    $('#' + this.dataset.id).toggle();
  });

  //searchbar interact
  $(".search-form .form-group").click(function(e) {
    $(this).css('width', '100%');
    $(this).css('border-radius', '4px 25px 25px 4px');
    e.stopPropagation();
  });

  $("#search").keyup(function() {
    $(".resultsSearch").show();
    var input = $("#search").val();

    $.post('http://vinci.aero/palendar/php/search.php', {search:input}, function(data, status) {
      if (status === "success") {
        $(".resultsSearch table tbody").html('');
        $.each(data, function(index, val) {
          $(".resultsSearch table tbody").append("<tr>" +
              "<td>" + val.pseudo + "</td></tr>");
        });
      }
    }, "json");
  });

});

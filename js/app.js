function getNumberFriendsGroups() {
  var tabgroups = $('.tabgroups a').text();
  var numbergroups = $('#mygroups table tbody tr').length;
  $('.tabgroups a').text(tabgroups + ' (' + numbergroups +')');

  var tabfriends = $('.tabfriends a').text();
  var numberfriends = $('#myfriends table tbody tr').length;
  $('.tabfriends a').text(tabfriends + ' (' + numberfriends +')');

}

function getMyPalendar() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'mypalendar');
  window.location.href = newlink;
}

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

$(window).on('load', function () {
  //searchbar & result search init
  $(document).click(function() {
    $(".search-form .form-group").css('width', '');
    $(".search-form .form-group").css('border-radius', '');
    $("#search").val('');
    $(".resultsSearch").hide();
  });


  $('.message a').click(function(){
     $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  });

  $('.settings-item').click(function () {
    $('#' + this.dataset.id).toggle();
  });

  $('#self').click(function(){
    getMyPalendar();
  });

  $('#modalNewGroup-image-input').on('change', function () {
    var reader = new FileReader();

    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        $('#modalNewGroup-image-preview').attr('src', e.target.result);
    };

    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]);
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

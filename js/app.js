function getMyPalendar() {
  window.location.href = "http://localhost/PalendarFront/views/mypalendar.html"
}

$(document).ready(function() {
  $('.message a').click(function(){
     $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  });

  $('.settings-item').click(function () {
    $('#' + this.dataset.id).toggle();
  });

  $(".search").keyup(function() {

  });
});

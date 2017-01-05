$(document).ready(function() {
  $('.message a').click(function(){
     $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  });

  $('#tabs').tabulous({
    effect: 'scale'
  });

  $('.settings-item').click(function () {
    $('#' + this.dataset.id).toggle();
  });
  $('#newGroup').click(function(){
    window.location.href = "http://localhost/PalendarFront/views/newGroup.html";
  });

});

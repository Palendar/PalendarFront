$(document).ready(function() {
  $('.message a').click(function(){
     $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  });

  $('#tabs').tabulous({
    effect: 'scale'
  });
});

function getNumberFriendsGroups() {
  var tabgroups = $('.tabgroups a').text();
  var numbergroups = $('#mygroups table tr').length;
  $('.tabgroups a').text(tabgroups + ' (' + numbergroups +')');

  var tabfriends = $('.tabfriends a').text();
  var numberfriends = $('#myfriends table tr').length;
  $('.tabfriends a').text(tabfriends + ' (' + numberfriends +')');

}

function getMyPalendar() {
  window.location.href = "http://localhost/PalendarFront/views/mypalendar.html"
}

$(document).ready(function() {

  getNumberFriendsGroups();

  $('.message a').click(function(){
     $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  });

  $('.settings-item').click(function () {
    $('#' + this.dataset.id).toggle();
  });

  $(".search").keyup(function() {

  });
});

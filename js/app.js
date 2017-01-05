function getNumberGroupsFriendsEvents() {
  var tabgroups = $('.tabgroups').text();
  var numbergroups = $('#tabs-1 table tr').length;
  $('.tabgroups').text(tabgroups + ' (' + numbergroups +')');

  var tabfriends = $('.tabfriends').text();
  var numberfriends = $('#tabs-2 table tr').length;
  $('.tabfriends').text(tabfriends + ' (' + numberfriends +')');

  var tabevents = $('.tabevents').text();
  var numberevents = $('#tabs-3 table tr').length;
  $('.tabevents').text(tabevents + ' (' + numberevents +')');

}

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

  getNumberGroupsFriendsEvents();

});

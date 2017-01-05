function getNumberGroupsFriendsEvents() {
  var tabgroups = 'Groups'
  var numbergroups = $('#tabs-1 table tr:not([style*="display: none"])').length;
  $('.tabgroups').text(tabgroups + ' (' + numbergroups +')');

  var tabfriends = 'Friends'
  var numberfriends = $('#tabs-2 table tr:not([style*="display: none"])').length;
  $('.tabfriends').text(tabfriends + ' (' + numberfriends +')');

  var tabevents = 'Events'
  var numberevents = $('#tabs-3 table tr:not([style*="display: none"])').length;
  console.log(numberevents);
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

  $(".search").keyup(function() {
    var resultsearch = $(".search").val();
    if(resultsearch === "") {
      $('tr').show();
      return;
    }
    $('tr').hide();
    $('tr').each(function() {
      if($(this).text().toLowerCase().indexOf(resultsearch.toLowerCase()) >= 0) {
        $(this).show();
        getNumberGroupsFriendsEvents();
      }
    });
  });
});

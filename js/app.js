function getNumberFriendsGroups() {
  var tabgroups = $('.tabgroups a').text();
  var numbergroups = $('#mygroups table tr').length;
  $('.tabgroups a').text(tabgroups + ' (' + numbergroups +')');

  var tabfriends = $('.tabfriends a').text();
  var numberfriends = $('#myfriends table tr').length;
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

$(document).ready(function() {

  getNumberFriendsGroups();

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
});

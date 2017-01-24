function getMyPalendar() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'mypalendar');
  window.location.href = newlink;
}

$(window).on('load', function () {

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

  //Create group
  $(".form-horizontal").submit(function(event) {
    var nameGroup = $("#modalNewGroup-name").val();
    var descriptionGroup = $("#newGroup-description").val();

    console.log(nameGroup + ' ' + descriptionGroup);
    var loginPostUrl = 'http://vinci.aero/palendar/php/createGroup.php';
    $.post(loginPostUrl, {name: nameGroup, description:descriptionGroup}, function(data, status) {
      if (status === "success") {
        console.log(data.id);
      }
    }, "json");
    event.preventDefault();
  });

  //  $(".group-fav:eq" + ID of hexagone).css
  $(".group-fav").each(function(index){
    $(this).css('background-image', "url('../img/group-fav/calendrier.png')");
    $(this).css('background-size', '100% 100%');
  });

  $(".notif-close").click(function(e){
    $("#notifications").css("left", "-250px");
    $(".notif-open").css("display", "block");
    $(this).css("display", "none");
  });

  $(".notif-open").click(function(e){
    $("#notifications").css("left", "0px");
    $(".notif-close").css("display", "block");
    $(this).css("display", "none");
  });
});

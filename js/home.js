function getMyPalendar() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'mypalendar');
  window.location.href = newlink;
}

function refreshHomeGroups(location) {
  console.log(location);
  if (location != null && location != "" && !!location) {
    var $slot = $("#grid").find("a").filter("[data-favid]=" + location);
    var $parentSlot = $slot.parent();
    $slot.css('display', 'none');
    $parentSlot.append("<span> Toto </span>");
  }
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

  $('#modalSettings-image-input').on('change', function () {
    var reader = new FileReader();

    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        $('#modal-image-preview').attr('src', e.target.result);
    };

    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]);
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

  //notification
  $(".notif-open").click(function(e){
    $("#notifications").css("left", "0px");
    $(".notif-close").css("display", "block");
    $(this).css("display", "none");

    $.getJSON('http://vinci.aero/palendar/php/getAllInvitationUser.php', function (data, status) {
      if (status === "success") {
          $.each(data, function(index, val) {
            $(".notifications-invitation table tbody").append("<tr>" +
                "<td>" + val.firstname + ' ' + val.lastname + " wants to be your friend !" + "</td>"+
                "<td><i id='acceptUser' class='fa fa-check' aria-hidden='true'></i></td>" +
                "<td><i class='fa fa-times' aria-hidden='true'></i></td>"+
                "<td class='idprofileUser' style='display:none;'>" + val.id+ "</td>"+
                "</tr>");
          });
      }
    });
  });

  //acceptUser
  $(".notifications-invitation table").on("click", "#acceptUser", function() {
    var idprofileUser = $(this).parent().parent().find(".idprofileUser").text();
    console.log(idprofileUser);
    /*$.post('http://vinci.aero/palendar/php/acceptUser.php', {id:'1'}, function(data, status) {
      if (status === "success") {
        //namedbb = data.name;
        console.log("acceptUser");
        console.log(data);
      }
    }, "json");*/
  });


  $("#modalNewGroup").on("show.bs.modal", function(){
    var $div = $("#modalNewGroup-name").parent();
    $("#modalNewGroup-name").val('');
    $("#modalNewGroup-name").remove();
    $div.append("<input type=\"text\" name=\"group-name\" id=\"modalNewGroup-name\" placeholder=\"Type in your group name\" required>");

    $("#modalNewGroup-description").val('');
    $("#modalNewGroup-image-input").val('');

    var $image = $('#modalNewGroup-image-preview');
    $image.removeAttr('src').replaceWith($image.clone());
  });

  $(".addGroup").on("click", function(e){
    var favId = $(this).parent().data('favid');
    var $slot = $("#grid").find("a");

    if(favId != null && favId != "" && !!favId){
      $("#modalNewGroup-favid").data("favid", favId);
      $("#modalNewGroup-favid").val(favId);
    } else {
      $("#modalNewGroup-favid").removeData("favid");
      $("#modalNewGroup-favid").val('');
    }
  });
});

function getMyPalendar() {
  var current = $(location).attr('href');
  var tabcurrent = current.split('/');
  var lastElement = tabcurrent[tabcurrent.length-1];
  var newlink = current.replace(lastElement,'mypalendar');
  window.location.href = newlink;
}

function refreshHomeGroups(location) {
  if (location != null && location != "" && !!location) {
    var $slot = $("#grid").find("a").filter("[data-favid]=" + location);
    var $parentSlot = $slot.parent();
    $slot.css('display', 'none');
    $parentSlot.append("<span> Toto </span>");
  }
}

//get number notif
function getNumberNotifs() {
  $.getJSON('http://vinci.aero/palendar/php/user/getNbrNotif.php', function (data, status) {
    if (status === "success") {
      if(data.nbr === '0') {
        $(".notif-number").hide();
      } else {
        $(".notif-number").show();
        $(".notif-number").text(data.nbr);
      }
    }
  });
}

//notifications friend
function getAllInvitationUser() {
  $(".notifications-invitation table tbody").html('');
  $.getJSON('http://vinci.aero/palendar/php/contact/getAllContactRequest.php', function (data, status) {
    if (status === "success") {
      if(data == null) {
        $(".notifications-invitation table tbody").append("<tr><td> no notification </td></tr>");
      } else {
        $.each(data, function(index, val) {
          $(".notifications-invitation table tbody").append("<tr>" +
              "<td>" + val.firstname + ' ' + val.lastname + " wants to be your friend." + "</td>"+
              "<td><i id='acceptUser' class='fa fa-check' aria-hidden='true'></i></td>" +
              "<td><i id='declineUser' class='fa fa-times' aria-hidden='true'></i></td>"+
              "<td class='idprofileUser' style='display:none;'>" + val.id+ "</td>"+
              "</tr>");
        });
      }
    }
  });
}

//notifications group
function getAllInvitationGroup() {
  $(".notifications-invitation-group table tbody").html('');
  $.getJSON('', function (data, status) {
    if (status === "success") {
      if(data == null) {
        $(".notifications-invitation-group table tbody").append("<tr><td> no notification </td></tr>");
      } else {
        $.each(data, function(index, val) {
          $(".notifications-invitation-group table tbody").append("<tr>" +
              "<td>" + val.name + " invites you to join the group." + "</td>"+
              "<td><i id='acceptGroup' class='fa fa-check' aria-hidden='true'></i></td>" +
              "<td><i id='declineGroup' class='fa fa-times' aria-hidden='true'></i></td>"+
              "<td class='idprofileGroup' style='display:none;'>" + val.id+ "</td>"+
              "</tr>");
        });
      }
    }
  });
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
    console.log($(this).attr('class'));
    $(this).css('background-image', "url('../img/group-fav/calendrier.png')");
    $(this).css('background-size', '100% 100%');
  });

  /**
  $(".notif-close").click(function(e){
    $("#notifications").css("left", "-250px");
    $(".notif-open").css("display", "block");
    $(this).css("display", "none");
  });


  $(".notif-open").click(function(e){
    $("#notifications").css("left", "0px");
    $(".notif-close").css("display", "block");
    $(this).css("display", "none");
    getAllInvitationUser();
  });**/

  getNumberNotifs();
  //notification hover open
  $(".notif-open").mouseenter(function(e){
    $("#notifications").css("left", "0px");
    $(".notif-close").css("display", "block");
    $(this).css("display", "none");
    getAllInvitationUser();
  });

  //notification hover close
  $("#notifications").mouseleave(function(e){
    $("#notifications").css("left", "-250px");
    $(".notif-open").css("display", "block");
    $(".notif-close").css("display", "none");
  });



  //acceptUser
  $(".notifications-invitation table").on("click", "#acceptUser", function() {
    var idprofileUser = $(this).parent().parent().find(".idprofileUser").text();
    $.post('http://vinci.aero/palendar/php/contact/acceptContact.php', {id:idprofileUser}, function(data, status) {
      if (status === "success") {
        //namedbb = data.name;
      }
    }, "json");
    getAllInvitationUser();
    getNumberNotifs();
  });

  //declineUser
  $(".notifications-invitation table").on("click", "#declineUser", function() {
    var idprofileUser = $(this).parent().parent().find(".idprofileUser").text();
    $.post('http://vinci.aero/palendar/php/contact/declineContact.php', {id:idprofileUser}, function(data, status) {
      if (status === "success") {
        //namedbb = data.name;
      }
    }, "json");
    getAllInvitationUser();
    getNumberNotifs();
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
    console.log('test' + favId);
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

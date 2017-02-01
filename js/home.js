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
      if(data.nbr == '0') {
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
        $.getJSON('http://vinci.aero/palendar/php/user/getNbrNotif.php', function (d, status) {
          if (status === "success") {
            if(d.nbr == '0') {
              $(".notifications-invitation table tbody").append("<tr><td> no notification </td></tr>");
              $(".notif-number").hide();
            } else {
              $(".notif-number").show();
              $(".notif-number").text(d.nbr);
            }
          }
        });
      } else {
        $.each(data, function(index, val) {
          $(".notifications-invitation table tbody").append("<tr>" +
              "<td>" + val.firstname + ' ' + val.lastname + " wants to be your friend." + "</td>"+
              "<td><i class='acceptUser fa fa-check' aria-hidden='true'></i></td>" +
              "<td><i class='declineUser fa fa-times' aria-hidden='true'></i></td>"+
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
  $.getJSON('http://vinci.aero/palendar/php/group/getAllGroupRequest.php', function (data, status) {
    if (status === "success") {
      if(data == null) {
        $.getJSON('http://vinci.aero/palendar/php/user/getNbrNotif.php', function (d, status) {
          if (status === "success") {
            if(d.nbr == '0') {
              $(".notif-number").hide();
            } else {
              $(".notif-number").show();
              $(".notif-number").text(d.nbr);
            }
          }
        });
      } else {
        $.each(data, function(index, val) {
          $(".notifications-invitation-group table tbody").append("<tr>" +
              "<td>" + val.firstname + ' ' + val.lastname + " invites you to join the group " + val.name + "</td>"+
              "<td><i class='acceptGroup fa fa-check' aria-hidden='true'></i></td>" +
              "<td><i class='declineGroup fa fa-times' aria-hidden='true'></i></td>"+
              "<td class='idprofileUser' style='display:none;'>" + val.id_user+ "</td>"+
              "<td class='idprofileGroup' style='display:none;'>" + val.id_group+ "</td>"+
              "</tr>");
        });
      }
    }
  });
}

//get group fav in homepage
function getAllGroupFavImage() {
  $.getJSON('http://vinci.aero/palendar/php/group/getAllGroup.php', function (data, status) {
    if (status === "success") {
      $.each(data, function(index, val) {
        $(".group-fav").each(function(i){
          if(i == index) {
            $(this).css('background-image', "url('../upload/group/" + val.image + "')");
            $(this).css('background-size', '100% 100%');
          }
        });
      });
    }
  });
}

$(window).on('load', function () {

  //get group fav in homepage
  getAllGroupFavImage();

  //get number notif
  getNumberNotifs();

  //click my palendar
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



  //click on group
  $(".group-fav").on("click", function(e){
    var favId = $(this).parent().data('favid');
    var urlbackground = $(this).css("background-image");
    var tabsplit = urlbackground.split('/');
    var idImage = tabsplit[tabsplit.length-1];
    var tabsplitname = idImage.split('.');
    var idGroup = tabsplitname[0];

    var $slot = $("#grid").find("a");

    if(favId != null && favId != "" && !!favId){
      $("#modalNewGroup-favid").data("favid", favId);
      $("#modalNewGroup-favid").val(favId);
    } else {
      $("#modalNewGroup-favid").removeData("favid");
      $("#modalNewGroup-favid").val('');
    }
    if(idGroup != 'none') {
      getGroup("?id="+idGroup);
    }
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

  //notification hover open
  $(".notif-open").mouseenter(function(e){
    $("#notifications").css("left", "0px");
    $(".notif-close").css("display", "block");
    $(this).css("display", "none");
    getAllInvitationUser();
    getAllInvitationGroup();
  });

  //notification hover close
  $("#notifications").mouseleave(function(e){
    $("#notifications").css("left", "-250px");
    $(".notif-open").css("display", "block");
    $(".notif-close").css("display", "none");
  });



  //acceptUser
  $(".notifications-invitation table").on("click", ".acceptUser", function() {
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
  $(".notifications-invitation table").on("click", ".declineUser", function() {
    var idprofileUser = $(this).parent().parent().find(".idprofileUser").text();
    $.post('http://vinci.aero/palendar/php/contact/declineContact.php', {id:idprofileUser}, function(data, status) {
      if (status === "success") {
        //namedbb = data.name;
      }
    }, "json");
    getAllInvitationUser();
    getNumberNotifs();
  });

  //acceptGroup
  $(".notifications-invitation-group table").on("click", ".acceptGroup", function() {
    var idprofileUser = $(this).parent().parent().find(".idprofileUser").text();
    var idprofileGroup = $(this).parent().parent().find(".idprofileGroup").text();
    console.log(idprofileUser + idprofileGroup);
    $.post('http://vinci.aero/palendar/php/group/acceptGroup.php', {id_user:idprofileUser, id_group:idprofileGroup}, function(data, status) {
      if (status === "success") {
        //namedbb = data.name;
      }
    }, "json");
    getAllInvitationGroup();
    getNumberNotifs();
    getAllGroupFavImage();
  });

  //declineGroup
  $(".notifications-invitation-group table").on("click", ".declineGroup", function() {
    var idprofileUser = $(this).parent().parent().find(".idprofileUser").text();
    var idprofileGroup = $(this).parent().parent().find(".idprofileGroup").text();
    $.post('http://vinci.aero/palendar/php/group/declineGroup.php', {id_user:idprofileUser, id_group:idprofileGroup}, function(data, status) {
      if (status === "success") {
        //namedbb = data.name;
      }
    }, "json");
    getAllInvitationGroup();
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

});

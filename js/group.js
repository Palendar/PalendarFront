var timeline; // the timeline object
var container; // the container object for the timeline
var items; // the items for the dataSet used in the timeline
var dataSet = []; // the dataSet for the timeline

var allEventsArray = []; // The array containing all the events with start, end, id etc
var allEventsSortedArray = []; // The sorted array of all the events for the navigation through buttons
var importedEvents = []; // Array storing the imported calendar events (ics files)
var classToColor = []; // Map key: classname, value: color

////// CHANGES TO DO >>>> nb USER >>> EVENTS PER USER
var synchroAllGroupEventArray = []; // array of all events of a group (use to compare)

var currentEventDisplayedId; // Id of the current display event

var options; // Configuration for the Timeline

var triggerPostCheck = false;

// Format date 'dd/mm/yyyy' TO 'yyyy-mm-dd'
function formatDate(dateToFormat) {
  var splitDate = dateToFormat.split('/');
  return splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
}

// Double-clicking on timeline to create an event triggers this
function setModalValues(prop){
  $("#modalNewEvent").modal("show");

  var $parent = $("#modalNewEvent-name").parent();
  $("#modalNewEvent-name").remove();
  $parent.append('<input type="text" name="newEvent-name" id="modalNewEvent-name" placeholder="Event title" required>');
  $("#modalNewEvent #modalNewEvent-description").val('');

  // Control on start date
  $("#modalNewEvent input[name='time-start-yyyy']").val(prop.time.getFullYear());
  $("#modalNewEvent input[name='time-start-mm']").val(prop.time.getMonth()+1);
  $("#modalNewEvent input[name='time-start-dd']").val(prop.time.getDate());
  $("#modalNewEvent input[name='time-start-hh']").val(prop.time.getHours());
  $("#modalNewEvent input[name='time-start-min']").val(prop.time.getMinutes());

  // Control on end date
  $("#modalNewEvent input[name='time-end-yyyy']").val(prop.time.getFullYear());
  $("#modalNewEvent input[name='time-end-mm']").val(prop.time.getMonth()+1);
  $("#modalNewEvent input[name='time-end-dd']").val(prop.time.getDate());
  $("#modalNewEvent input[name='time-end-hh']").val(prop.time.getHours());
  $("#modalNewEvent input[name='time-end-min']").val(prop.time.getMinutes());
}

// Selecting an item on the timeline displays its data
function displayEventInfo(selectedEventId){
  var $eventTitle = $('#group-event-title');
  var $eventDescription = $('#group-event-description');
  var $eventStartTime = $('#group-event-start');
  var $eventEndStime = $('#group-event-end');
  currentEventDisplayedId = selectedEventId;

  if (selectedEventId){
    var selectedItem = allEventsArray[currentEventDisplayedId];

    $eventTitle.html(selectedItem.title);
    $eventDescription.html(selectedItem.content);
    $eventStartTime.html(selectedItem.start);
    $eventEndStime.html(selectedItem.end);
  } else {
    $eventTitle.html('');
    $eventDescription.html('');
    $eventStartTime.html('');
    $eventEndStime.html('');
  }
}

// Validation for input inside the event creation modal
function validateNumber(event) {
    var key = window.event ? event.keyCode : event.which;
    if (event.keyCode === 8 || event.keyCode === 46) {
        return true;
    } else if ( key < 48 || key > 57 ) {
        return false;
    } else {
    	return true;
    }
};

function moveTimeline (percentage) {
  var range = timeline.getWindow();
  var interval = range.end - range.start;

  timeline.setWindow({
    start: range.start.valueOf() - interval * percentage,
    end:   range.end.valueOf()   - interval * percentage
  });
}

function focusNow(){
  timeline.moveTo(new Date());
}

function loadCssForImportedCalendars(){
  for (var className in classToColor){
    var color = classToColor[className];
    $("." + className).css('background-color', color);
  }
}

$(window).on('load', function () {
  var idd = window.location.search.substr(1).split("=")[1];

  //slide friends
  $("#buttonaddfriends").click(function() {
    $("#invit-friends").slideToggle();
  });

  //get members in group
  $.post('http://vinci.aero/palendar/php/group/getAllGroupUser.php', {id_group:'18'}, function(data, status) {
    if (status === "success") {
      console.log(data);
      $.each(data, function(index, val) {
        if(val.image === '') {
          $("#get-members table tbody").append("<tr>" +
              "<td>" + "<img class='imagegroup' src='../upload/user/default.jpeg'>" + val.firstname + ' ' + val.lastname + "</td>" +
              "<td class='idprofilefriend' style='display:none;'>" + val.id+ "</td>"+ "</tr>");
        } else {
          $("#get-members table tbody").append("<tr>" +
              "<td>" + "<img class='imagegroup' src='../upload/user/" + val.image + "'>" + val.firstname + ' ' + val.lastname + "</td>" +
              "<td class='idprofilefriend' style='display:none;'>" + val.id+ "</td>"+ "</tr>");
        }
      });
    }
  }, "json");

  //add friend in group
  $("#invit-friends table").on("click", ".invitfriendtogroup", function() {
    var idprofile = $(this).parent().parent().find(".idprofilefriend").text();
    var current = $(location).attr('href');
    var tabcurrent = current.split('=');
    var idGroup = tabcurrent[tabcurrent.length-1];

    $.post('http://vinci.aero/palendar/php/group/inviteGroup.php', {id_user:idprofile, id_group:idGroup}, function(data, status) {
      if (status === "success") {
        //namedbb = data.name;
        console.log(data);
        alert("Invitation sent !");
      }
    }, "json");
  });

  //get all friend to add group
  $.getJSON('http://vinci.aero/palendar/php/contact/getAllContact.php', function (data, status) {
    if (status === "success") {
      $.each(data, function(index, val) {
        if(val.image === '') {
          $("#invit-friends table tbody").append("<tr>" +
              "<td>" + "<img class='imagegroupsmall' src='../upload/user/default.jpeg'>"  + val.firstname + ' ' + val.lastname + "</td>"+
              "<td class='idprofilefriend' style='display:none;'>" + val.id+ "</td>"+
              "<td><i class='invitfriendtogroup fa fa-plus' aria-hidden='true'></td></tr>");
        } else {
          $("#invit-friends table tbody").append("<tr>" +
              "<td>" + "<img class='imagegroupsmall' src='../upload/user/" + val.image + "'>"  + val.firstname + ' ' + val.lastname + "</td>"+
              "<td class='idprofilefriend' style='display:none;'>" + val.id+ "</td>"+
              "<td><i class='invitfriendtogroup fa fa-plus' aria-hidden='true'></td></tr>");
        }
      })
    }
  });

  $('.newEvent-form input[type="number"]').keypress(validateNumber);

  container = $('#group-calendar-timeline')[0];

  var currentDate = new Date();

  options = {
    width: '100%',
    height: '250px',
    min: new Date(currentDate.getFullYear()-1, currentDate.getMonth(), currentDate.getDate()),                // lower limit of visible range
    max: new Date(currentDate.getFullYear()+1, currentDate.getMonth(), currentDate.getDate()),                // upper limit of visible range
    zoomMin: 1000 * 60 * 60 * 8,             // 8 hours in milliseconds
    zoomMax: 1000 * 60 * 60 * 24 * 20,    // about 20 days in milliseconds
    editable: {
      add: false,         // add new items by double tapping
      updateTime: true,  // drag items horizontally
      updateGroup: true, // drag items from one group to another
      remove: true,       // delete an item by tapping the delete button top right
      overrideItems: false  // allow these options to override item.editable
    },
  };

  $("#newEvent-submit").on('click', function(event) {
    event.preventDefault();
    var time_start = $("#modalNewEvent input[name='time-start-yyyy']").val() + '-' +
                   $("#modalNewEvent input[name='time-start-mm']").val() + '-' +
                   $("#modalNewEvent input[name='time-start-dd']").val() + ' ' +
                   $("#modalNewEvent input[name='time-start-hh']").val() + ':' +
                   $("#modalNewEvent input[name='time-start-min']").val() + ':00';
   var time_end = $("#modalNewEvent input[name='time-end-yyyy']").val() + '-' +
                  $("#modalNewEvent input[name='time-end-mm']").val() + '-' +
                  $("#modalNewEvent input[name='time-end-dd']").val() + ' ' +
                  $("#modalNewEvent input[name='time-end-hh']").val() + ':' +
                  $("#modalNewEvent input[name='time-end-min']").val() + ':00';
    var description = $("#modalNewEvent input[name='newEvent-description']").val();

    var name = $("#modalNewEvent input[name='newEvent-name']").val();
    var id_group = window.location.search.substr(1).split('=')[1];

    $.post('http://vinci.aero/palendar/php/group/createGroupEvent.php', {id_group:id_group, description: description, name: name, time_start: time_start, time_end: time_end}, function(data, status) {
      if (status === "success") {
        loadCustomEvents([data]);
        refreshTimelineEvents();
        loadCssForImportedCalendars();
        timeline.redraw();
      } else {
        console.log("ecc", data);
      }
    }, "json");
    $("#modalNewEvent").modal("hide");
  });

  //Focus and select the new event
  function refreshCurrentSelectedEvent(newEventId){
    currentEventDisplayedId = newEventId;
    displayEventInfo(newEventId);
    timeline.focus(newEventId);
    timeline.setSelection(newEventId);
  }

  //bind the different buttons to navigate inside the timeline
  function bindTimelineButtons(){
    // Navigation buttons for events display
    $("#group-event-previous").on("click", function(e){
      var length = allEventsSortedArray.length;
      for (var i=0; i<length; i++){
        var item = allEventsSortedArray[i];
        // Check if we found the item, and then if we aren't at the last event
        if ((item.id == currentEventDisplayedId) && (i > 0)){
          var newEventId = allEventsSortedArray[i-1].id;
          refreshCurrentSelectedEvent(newEventId);
          break;
        }
      }
    });
    $("#group-event-next").on("click", function(e){
      var length = allEventsSortedArray.length;
      for (var i=0; i<length; i++){
        var item = allEventsSortedArray[i];
        // Check if we found the item, and then if we aren't at the first event
        if ((item.id == currentEventDisplayedId) && (i < length)){
          var newEventId = allEventsSortedArray[i+1].id;
          refreshCurrentSelectedEvent(newEventId);
          break;
        }
      }
    });

    // Zoom buttons
    $("#zoomIn").on("click", function(e){
      timeline.zoomIn(0.3);
    });
    $("#zoomOut").on("click", function(e){
      timeline.zoomOut(0.3);
    });

    // Navigation buttons for the timeline (left and right and go back to current time)
    $("#timeline-moveLeft").on("click", function(e){
      moveTimeline(0.3);
    });
    $("#timeline-moveRight").on("click", function(e){
      moveTimeline(-0.3);
    });
    $("#timeline-moveCurrent").on("click", function(e){
      focusNow();
    });

  }

  // Displays the timeline and the events
  function displayEventsOnTimeline(){
    items = new vis.DataSet(dataSet);
    // Create a Timeline
    timeline = new vis.Timeline(container, items, options);

    timeline.on("doubleClick", function(prop){
      setModalValues(prop);
    });

    timeline.on("select", function(prop){
      displayEventInfo(prop.items[0]);
      timeline.focus(prop.items[0]);
    });

    timeline.on("click", function(prop){
      if(prop.item == null && currentEventDisplayedId){
        displayEventInfo(false);
      }
    });

    timeline.on("rangechange", function(prop){
      timeline.off("click");
    });

    timeline.on("rangechanged", function(prop){
      setTimeout(function(){
        timeline.on("click", function(prop){
          if(prop.item == null && currentEventDisplayedId){
            displayEventInfo(false);
          }
        });
      }, 100);
    });

    bindTimelineButtons();
    focusNow();
  }

  // Refresh the event list after retrieving dataSet
  function refreshTimelineEvents(){
    timeline.setItems(new vis.DataSet(dataSet));
    timeline.redraw();
    loadCssForImportedCalendars();
  }

  function addEventToSynchroArray(start, end){
    synchroAllGroupEventArray.push({
      start: start,
      end: end
    });

    synchroAllGroupEventArray.sort(function(a,b){
      return new Date(a.start) - new Date(b.start);
    });
  }

  // load events from ical
  function loadEventsFromIcs(events, group){
    var item;
    var id = 0;

    for(var i in events){
      var event = events[i];
      item = {};
      var formattedDate = formatDate(event.start_date);

      item.id = group + '-' + id;
      item.content = event.SUMMARY;
      item.start = formattedDate + ' ' + event.start_time;
      item.end = formattedDate + ' ' + event.end_time;
      item.className = group;
      item.editable = false;
      id += 1;

      allEventsArray[item.id] = {
        title: item.content,
        content: item.content,
        start: item.start,
        end: item.end
      }

      allEventsSortedArray.push({
        id: item.id,
        start: item.start
      });

      allEventsSortedArray.sort(function(a,b){
        return new Date(a.start) - new Date(b.start);
      });

      addEventToSynchroArray(item.start, event.time_end);

      dataSet.push(item);
    }
  }

  // load personnal events
  function loadCustomEvents(events){
    var item;
    if (events){
      for(var i in events){
        var event = events[i];
        item = {};

        item.id = 'custom-user-' + event.id_user + '-event-' + event.id;
        item.content = event.description;
        item.start = event.time_start;
        if (new String(event.time_start).valueOf() !== new String(event.time_end).valueOf()){
          item.end = event.time_end;
        }
        item.editable = false;

        allEventsArray[item.id] = {
          title: event.name,
          content: item.content,
          start: item.start,
          end: event.time_end
        }

        allEventsSortedArray.push({
          id: item.id,
          start: item.start
        });

        allEventsSortedArray.sort(function(a,b){
          return new Date(a.start) - new Date(b.start);
        });

        addEventToSynchroArray(item.start, event.time_end);

        dataSet.push(item);
      }
      refreshTimelineEvents();
    }
  }

  function addEvents(calendar_id, calendar_events, callback){
    importedEvents['cal-' + calendar_id].events = calendar_events;
    if(callback){
      for(var i in importedEvents){
        var cal = importedEvents[i];
        loadEventsFromIcs(cal.events, cal.name);
        displayEventsOnTimeline();
      }
      callback();
    }
  }
  //get all ical in my palendar
  $.getJSON('http://vinci.aero/palendar/php/calendar/getAllIcal.php', function (data, status) {
    if (status === "success") {
      for (var i = 0; i < data.length; i++){
        // Used to find the right calendar on the server
        var cal_id = data[i].id;
        var ical_file = "../upload/ical/" + cal_id + ".ics";

        // Used to identify the calendar to be loaded on the timeline later on, associated with a color
        var cal_name = data[i].name + '-' + cal_id;
        var cal_color = data[i].color;
        importedEvents['cal-' + cal_id] = {
          id: cal_id,
          name: cal_name
        };
        classToColor[cal_name] = cal_color;
        if (i < data.length -1) {
          new ical_parser(ical_file, function(cal){
              //When ical parser has loaded file
              //get future events
              var cal_id = cal.feed_url.split('/')[3].split('.')[0];
              events = cal.getFutureEvents();
              addEvents(cal_id, events, false);
          });
        } else {
          new ical_parser(ical_file, function(cal){
              //When ical parser has loaded file
              //get future events
              var cal_id = cal.feed_url.split('/')[3].split('.')[0];
              events = cal.getFutureEvents();
              addEvents(cal_id, events, loadPersonnalEvents);
          });
        }
      }
    }
  });



  // Function to get all the events of all users in a group
  function loadAllGroupEvents (){
    if (!triggerPostCheck){
      triggerPostCheck = true;
      $.post('http://vinci.aero/palendar/php/group/getAllGroupEvent.php', {id_group: idd}, function (data, status) {
        if (status === "success") {
          console.log('GET ALL GROUP EVENT', data);
          if(data){
            for (var i=0; i<data.length; i++){
              var event = data[i];
              addEventToSynchroArray(event.time_start, event.time_end);
            }
          }

        }
      },"json");
      /*$.post('http://vinci.aero/palendar/php/group/getAllGroupIcal.php', {id_group: idd}, function (data, status) {
        if (status === "success") {
          console.log('GET AL LGROUP ICAL');
          startProcess(data);
        }
      }, "json");*/
    }
  }

  // get all events from the group
  function loadGroupEvents() {
    var id_group = window.location.search.substr(1).split("=")[1];
    $.post('http://vinci.aero/palendar/php/group/getAllGroupMyEvent.php', {id_group: id_group}, function (data, status) {
      if (status === "success") {
        console.log('GET ALL EVENTS FOR THE GROUP');
          loadCustomEvents(data);
          loadAllGroupEvents();
        }
      }, "json");
  }
  // Get all events from personnal account
  function loadPersonnalEvents() {
    $.getJSON('http://vinci.aero/palendar/php/calendar/getAllEvent.php', function (data, status) {
      if (status === "success") {
        console.log("GET ALL EVENTS FOR ME")
          loadCustomEvents(data);
          loadAllGroupEvents();
        }
      }
    );
    loadGroupEvents();
  }

  function startProcess(data){
    for (var i = 0; i < data.length; i++){
      // Used to find the right calendar on the server
      var cal_id = data[i].id;
      var ical_file = "../upload/ical/" + cal_id + ".ics";

      // Used to identify the calendar to be loaded on the timeline later on, associated with a color
      var cal_name = data[i].name + '-' + cal_id;
      var cal_color = data[i].color;
      importedEvents['cal-' + cal_id] = {
        id: cal_id,
        name: cal_name
      };
      new ical_parser(ical_file, function(cal){
          //When ical parser has loaded file
          //get future events
          var cal_id = cal.feed_url.split('/')[3].split('.')[0];
          events = cal.getFutureEvents();
          if (events) {
            for (var i in events){
              var event = events[i];
              var formattedDate = formatDate(event.start_date);
              var item = {};
              item.start = formattedDate + ' ' + event.start_time;
              item.end = formattedDate + ' ' + event.end_time;

              addEventToSynchroArray(item.start, item.end);
            }
          }
      });
    }
  }
});

var timeline;
var container;
var items;
var dataSet = [];

var allEventsArray = [];
var allEventsSortedArray = [];

var currentEventDisplayedId;

// Configuration for the Timeline
var options;

// Format date 'dd/mm/yyyy' TO 'yyyy-mm-dd'
function formatDate(dateToFormat) {
  var splitDate = dateToFormat.split('/');
  return splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
}

// Double-clicking on timeline to create an event triggers this
function setModalValues(prop){
  $("#modalNewEvent").modal("show");

  // Control on start date
  $("#modalNewEvent input[name='time-start-yyyy']").val(prop.time.getFullYear());
  $("#modalNewEvent input[name='time-start-mm']").val(prop.time.getMonth()+1);
  $("#modalNewEvent input[name='time-start-dd']").val(prop.time.getDay());
  $("#modalNewEvent input[name='time-start-hh']").val(prop.time.getHours());
  $("#modalNewEvent input[name='time-start-min']").val(prop.time.getMinutes());

  // Control on end date
  $("#modalNewEvent input[name='time-end-yyyy']").val(prop.time.getFullYear());
  $("#modalNewEvent input[name='time-end-mm']").val(prop.time.getMonth()+1);
  $("#modalNewEvent input[name='time-end-dd']").val(prop.time.getDay());
  $("#modalNewEvent input[name='time-end-hh']").val(prop.time.getHours());
  $("#modalNewEvent input[name='time-end-min']").val(prop.time.getMinutes());
}

// Selecting an item on the timeline displays its data
function displayEventInfo(selectedEventId){
  var $eventTitle = $('#mypalendar-event-title');
  var $eventDescription = $('#mypalendar-event-description');
  var $eventStartTime = $('#mypalendar-event-start');
  var $eventEndStime = $('#mypalendar-event-end');
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


$(window).on('load', function () {
  $('.newEvent-form input[type="number"]').keypress(validateNumber);

  var ical_file = "../ical/basic.ics";

  container = $('#mypalendar-calendar-timeline')[0];

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

  $(".newEvent-form").submit(function(event) {
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
    var id_group = 1;
    var id_user = 1;
    var name = $("#modalNewEvent input[name='newEvent-name']").val();

    var loginPostUrl = 'http://vinci.aero/palendar/php/group/createEvent.php';

    $.post(loginPostUrl, {description: description, id_group: id_group, nom: name, time_start: time_start, time_end: time_end}, function(data, status) {
      if (status === "success") {
        console.log("ss",data);
      } else {
        console.log("ecc", data);
      }
    }, "json");
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
    $("#mypalendar-event-previous").on("click", function(e){
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
    $("#mypalendar-event-next").on("click", function(e){
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
    allEventsSortedArray.sort(function(a,b){
      return new Date(a.start) - new Date(b.start);
    });
    bindTimelineButtons();
    focusNow();
  }

  //Display All future events in ical file as list.
  function loadEvents(events){
    var item;
    var id = 0;
    //Foreach event
    events.forEach(function(event){
      item = {};
      var formattedDate = formatDate(event.start_date);

      item.group = 'daniel-exemple';
      item.id = item.group + '-' + id;
      item.content = event.SUMMARY;
      item.start = formattedDate + ' ' + event.start_time;
      item.end = formattedDate + ' ' + event.end_time;
      item.className = 'timeline-item-' + item.group;
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

      dataSet.push(item);
    });
    displayEventsOnTimeline();
  }

  new ical_parser(ical_file, function(cal){
      //When ical parser has loaded file
      //get future events
      events = cal.getFutureEvents();
      //And display them
      loadEvents(events);
  });
});

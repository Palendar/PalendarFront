var timeline;
var container;
var items;
var dataSet = [];

// Configuration for the Timeline
var options;

// Format date 'dd/mm/yyyy' TO 'yyyy-mm-dd'
function formatDate(dateToFormat) {
  var splitDate = dateToFormat.split('/');
  return splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
}

function setModalValues (prop) {
  $("#modalNewEvent").modal("show");

  // Control on start date
  $("#modalNewEvent input[name='time-start-yyyy']").val(prop.time.getFullYear());
  $("#modalNewEvent input[name='time-start-mm']").val(prop.time.getMonth()+1);
  $("#modalNewEvent input[name='time-start-dd']").val(prop.time.getDay());
  $("#modalNewEvent input[name='time-start-hh']").val(prop.time.getHours());
  $("#modalNewEvent input[name='time-start-min']").val(prop.time.getMinutes());

  // Controle on end date
  $("#modalNewEvent input[name='time-end-yyyy']").val(prop.time.getFullYear());
  $("#modalNewEvent input[name='time-end-mm']").val(prop.time.getMonth()+1);
  $("#modalNewEvent input[name='time-end-dd']").val(prop.time.getDay());
  $("#modalNewEvent input[name='time-end-hh']").val(prop.time.getHours());
  $("#modalNewEvent input[name='time-end-min']").val(prop.time.getMinutes());

}

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

$(window).on('load', function () {
  $('.newEvent-form input[type="number"]').keypress(validateNumber);

  var timelineItemId = 0;

  var ical_file = "../ical/basic.ics";

  container = $('#mypalendar-calendar-timeline')[0];
  options = {
    width: '100%',
    height: '250px',
    editable: {
      add: true,         // add new items by double tapping
      updateTime: true,  // drag items horizontally
      updateGroup: true, // drag items from one group to another
      remove: true,       // delete an item by tapping the delete button top right
      overrideItems: false  // allow these options to override item.editable
    },
    onAdd: function (item, callback) {
    }
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

    var loginPostUrl = 'http://vinci.aero/palendar/php/createEvent.php';

    $.post(loginPostUrl, {description: description, id_group: id_group, nom: name, time_start: time_start, time_end: time_end}, function(data, status) {
      console.log("data", data, status);
      if (status === "success") {
        console.log("ss",data);
      } else {
        console.log("ecc", data);
      }
    }, "json");
  });

  //Display All future events in ical file as list.
  function displayDemo(events){
    var item;
    //Foreach event
    events.forEach(function(event){
      item = {};
      var formattedDate = formatDate(event.start_date);

      item.group = 'daniel-exemple';
      item.content = event.SUMMARY;
      item.start = formattedDate + ' ' + event.start_time;
      item.end = formattedDate + ' ' + event.end_time;
      item.className = 'timeline-item-' + item.group;
      item.editable = false;

      dataSet.push(item);

      timelineItemId += 1;
    });
    items = new vis.DataSet(dataSet);
    // Create a Timeline
    timeline = new vis.Timeline(container, items, options);
    timeline.on("doubleClick", function(prop){
      setModalValues(prop);
    });
  }

  new ical_parser(ical_file, function(cal){
                    //When ical parser has loaded file
                    //get future events
                    events = cal.getFutureEvents();
                    //And display them
                    displayDemo(events);
                });
});

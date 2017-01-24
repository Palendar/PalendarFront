$(window).on('load', function () {
  var timelineItemId = 0;

  var ical_file = "../ical-temp/basic.ics";

  var container = $('#mypalendar-calendar-timeline')[0];

  var dataSet = [];

  // Configuration for the Timeline
  var options = {
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
      console.log(item, item.start.toString());
      callback(item);
    }
  };

  // Format date 'dd/mm/yyyy' TO 'yyyy-mm-dd'
  function formatDate(dateToFormat) {
    var splitDate = dateToFormat.split('/');
    return splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
  }

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
    var items = new vis.DataSet(dataSet);
    // Create a Timeline
    var timeline = new vis.Timeline(container, items, options);
  }

  new ical_parser(ical_file, function(cal){
                    //When ical parser has loaded file
                    //get future events
                    events = cal.getFutureEvents();
                    //And display them
                    displayDemo(events);
                });
});

$(window).on('load', function () {

  //add friend in group
  $("#buttonaddfriends").click(function() {
    $("#invit-friends").slideToggle();
  });

  var container = $('#group-calendar-timeline')[0];

  // Create a DataSet (allows two way data-binding)
  var items = new vis.DataSet([
    {id: 1, content: 'item 1', start: '2013-04-20'},
    {id: 2, content: 'item 2', start: '2013-04-14'},
    {id: 3, content: 'item 3', start: '2013-04-18', end: '2013-04-19'},
    {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
    {id: 5, content: 'item 5', start: '2013-04-25'},
    {id: 6, content: 'item 6', start: '2013-04-27'}
  ]);

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
  // Create a Timeline
  var timeline = new vis.Timeline(container, items, options);
});

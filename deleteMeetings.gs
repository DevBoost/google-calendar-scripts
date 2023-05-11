function deleteMeetingsWithMoreThanTwoParticipants() {
  deleteMeetings(2);
}

function deleteMeetings(maxNumberOfParticipants) {
  // TODO Adjust this to the name of your calendar
  var calendarName = 'YourCalendar';

  // Caution: Months start at 0 so January is 0, February is 1, ...
  var fromDate = new Date(2023, 0, 1, 0, 0, 0);
  var toDate = new Date(2023, 11, 1, 0, 0, 0);

  var calendar = CalendarApp.getCalendarsByName(calendarName)[0];
  var events = calendar.getEvents(fromDate, toDate);
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    var participantCount = event.getGuestList().length;
    Logger.log(event.getTitle() + ": " + participantCount + " participant(s)");
    if (participantCount > maxNumberOfParticipants) {
      Logger.log("Deleting event: "+ event.getTitle() + "...");
      event.deleteEvent();
    }
  }
}

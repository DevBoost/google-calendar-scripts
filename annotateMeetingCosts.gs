function annotateMeetingCosts() {
  doAnnotateMeetingCosts(3);
}

function doAnnotateMeetingCosts(minNumberOfParticipants) {
  // TODO Adjust this to whatever the average hourly rate in your company is
  var averageHourlyRate = 100;

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
    var durationInHours = (event.getEndTime() - event.getStartTime()) / 1000 / 60 / 60;
    Logger.log(event.getTitle() + ": " + participantCount + " participant(s) - " + durationInHours + " hour(s)");
    if (participantCount > (minNumberOfParticipants - 1)) {
      var description = event.getDescription();
      if (description.match("Estimated costs for this meeting:.*")) {
        var regex = new RegExp('Estimated costs for this meeting:.*', 'gi');
        description = description.replace(regex, "");
      }

      description = description + "Estimated costs for this meeting: " + (participantCount * durationInHours * averageHourlyRate) + "€";
      Logger.log("New description for event '"+ event.getTitle() + "' is '" + description + "'");
      event.setDescription(description);
    }
  }
}

function annotateMeetingCosts() {
  var daysToAnnotateFromNow = 7;
  // TODO Adjust this to whatever the average hourly rate in your company is
  var averageHourlyRate = 100;
  // TODO Adjust this to the ID of your calendar
  doAnnotateMeetingCosts('YourCalendarID', 2, daysToAnnotateFromNow, averageHourlyRate);
}

function doAnnotateMeetingCosts(calendarId, minNumberOfParticipants, daysToAnnotateFromNow, averageHourlyRate) {
  var fromDate = new Date();
  fromDate.setTime(Date.now());

  var toDate = new Date();
  toDate.setTime(fromDate.getTime() + 1000 * 60 * 60 * 24 * daysToAnnotateFromNow);

  var calendar = CalendarApp.getCalendarById(calendarId);
  var events = calendar.getEvents(fromDate, toDate);
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    var creators = event.getCreators();
    if (creators.indexOf(calendarId) < 0) {
      Logger.log("Skipping event " + event.getTitle() + ", because " + calendarId + " is not the creator");
      continue;
    }

    var uniqueParticipants = new Set();
    var guests = event.getGuestList();
    guests.forEach(guest => uniqueParticipants.add(guest.getEmail()));
    creators.forEach(creator => uniqueParticipants.add(creator));
    var participantCount = uniqueParticipants.size;
    var durationInHours = (event.getEndTime() - event.getStartTime()) / 1000 / 60 / 60;
    Logger.log(event.getTitle() + ": " + participantCount + " participant(s) - " + durationInHours + " hour(s)");
    if (participantCount > (minNumberOfParticipants - 1)) {
      var description = event.getDescription();
      if (description.match("Estimated costs for this meeting:.*")) {
        var regex = new RegExp('Estimated costs for this meeting:.*', 'gi');
        description = description.replace(regex, "");
      }

      description = description.trim();
      var costs = Math.floor(participantCount * durationInHours * averageHourlyRate);
      description = description + "\n\nEstimated costs for this meeting: " + (costs) + "€";
      Logger.log("New description for event '"+ event.getTitle() + "' is '" + description + "'");
      event.setDescription(description);
    }
  }
}

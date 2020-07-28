import { compareAsc, sub } from "date-fns";

export function initializeCalendar(calendar) {
  let query = {};
  query.url = calendar.url.replace("webcal://", "http://");


  // const calendarConfig = {
  //   maximumEntries: calendar.maximumEntries,
  //   maximumNumberOfDays: calendar.maximumNumberOfDays,
  //   broadcastPastEvents: calendar.broadcastPastEvents,
  // };
  // if (calendar.symbolClass === "undefined" || calendar.symbolClass === null) {
  //   calendarConfig.symbolClass = "";
  // }
  // if (calendar.titleClass === "undefined" || calendar.titleClass === null) {
  //   calendarConfig.titleClass = "";
  // }
  // if (calendar.timeClass === "undefined" || calendar.timeClass === null) {
  //   calendarConfig.timeClass = "";
  // }

  let auth = calendar.auth;
  // we check user and password here for backwards compatibility with old configs
  if (!auth && calendar.user && calendar.pass) {
    console.warn(
      "Deprecation warning: Please update your calendar authentication configuration."
    );
    console.warn(
      "https://github.com/MichMich/MagicMirror/tree/v2.1.2/modules/default/calendar#calendar-authentication-options"
    );
    auth = {
      user: calendar.user,
      pass: calendar.pass,
      method: "basic"
    }
  }
  if (auth) {
    switch (auth.method) {
      case "digest":
        break;
      case "bearer":
        fetch.headers = {
          Authorization: `Bearer ${auth.pass}`
        }
        break;
      case "basic":
      default:
        fetch.headers = {
          Authorization: `Basic ${atob(calendar.user + ":" + calendar.pass)}`,
        };
        break;
    }
    // don't send passwords over HTTP
    query.url = query.url.replace("http://", "https://");
  }
  return query;
}


function fetchCalendar(auth) {}

function testTitleByFilter(title, filter, useRegex, regexFlags) {
  if (useRegex) {
    // Assume if leading slash, there is also trailing slash
    if (filter[0] === "/") {
      // Strip leading and trailing slashes
      filter = filter.substr(1).slice(0, -1);
    }

    filter = new RegExp(filter, regexFlags);

    return filter.test(title);
  } else {
    return title.includes(filter);
  }
}

/* getTitleFromEvent(event)
 * Gets the title from the event.
 *
 * argument event object - The event object to check.
 *
 * return string - The title of the event, or "Event" if no title is found.
 */
function getTitleFromEvent(event) {
  let title = "Event";
  if (event.summary) {
    title =
      typeof event.summary.val !== "undefined"
        ? event.summary.val
        : event.summary;
  } else if (event.description) {
    title = event.description;
  }

  return title;
}

/* timeFilterApplies()
 * Determines if the user defined time filter should apply
 *
 * argument now Date - Date object using previously created object for consistency
 * argument endDate Moment - Moment object representing the event end date
 * argument filter string - The time to subtract from the end date to determine if an event should be shown
 *
 * return bool - The event should be filtered out
 */
const timeFilterApplies = function (now, endDate, filter) {
  if (filter) {
    const until = filter.split(" "),
      value = parseInt(until[0]),
      increment = until[1].slice(-1) === "s" ? until[1] : until[1] + "s", // Massage the data for moment js
      filterUntil = sub(endDate, increment)//moment(endDate.format()).subtract(value, increment);

    return now < filterUntil.format("x");
  }

  return false;
};

/* isFullDayEvent(event)
 * Checks if an event is a fullday event.
 *
 * argument event object - The event object to check.
 *
 * return bool - The event is a fullday event.
 */
function isFullDayEvent(event) {
  if (event.start.length === 8 || event.start.dateOnly) {
    return true;
  }

  const start = event.start || 0;
  const startDate = new Date(start);
  const end = event.end || 0;
  // Is 24 hours, and starts on the middle of the night.
  return ((end - start) % (24 * 60 * 60 * 1000) === 0 && startDate.getHours() === 0 && startDate.getMinutes() === 0);
};
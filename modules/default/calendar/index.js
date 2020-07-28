import "./calendar.css";
import { useFetchText, assignDefaults, useQuery } from "@mm/core";
import { initializeCalendar } from "./functions";
import ical from "ical";

export default function Calendar(props) {
	let { name, config } = props;
	config = { ...defaults, ...config };

  const calendars = config.calendars.map(({ }) => 0);
	const icals = useFetchText(calendars, config.fetchInterval);
}

function Fader(props) {
  const { items, fade, fadePoint } = props;

}

const defaults = {
  maximumEntries: 10, // Total Maximum Entries
  maximumNumberOfDays: 365,
  displaySymbol: true,
  defaultSymbol: "calendar", // Fontawesome Symbol see https://fontawesome.com/cheatsheet?from=io
  showLocation: false,
  displayRepeatingCountTitle: false,
  defaultRepeatingCountTitle: "",
  maxTitleLength: 25,
  maxLocationTitleLength: 25,
  wrapEvents: false, // wrap events to multiple lines breaking at maxTitleLength
  wrapLocationEvents: false,
  maxTitleLines: 3,
  maxEventTitleLines: 3,
  fetchInterval: 5 * 60 * 1000, // Update every 5 minutes.
  animationSpeed: 2000,
  fade: true,
  urgency: 7,
  timeFormat: "relative",
  dateFormat: "MMM Do",
  dateEndFormat: "LT",
  fullDayEventDateFormat: "MMM Do",
  showEnd: false,
  getRelative: 6,
  fadePoint: 0.25, // Start on 1/4th of the list.
  hidePrivate: false,
  hideOngoing: false,
  colored: false,
  coloredSymbolOnly: false,
  tableClass: "small",
  calendars: [
    {
      symbol: "calendar",
      url: "https://www.calendarlabs.com/templates/ical/US-Holidays.ics"
    }
  ],
  titleReplace: {
    "De verjaardag van ": "",
    "'s birthday": ""
  },
  locationTitleReplace: {
    "street ": ""
  },
  broadcastEvents: true,
  excludedEvents: [],
  sliceMultiDayEvents: false,
  broadcastPastEvents: false,
  nextDaysRelative: false
}




const CalendarFetcher = function (url, reloadInterval, excludedEvents, maximumNumberOfDays, auth, includePastEvents) {

	let fetchFailedCallback = function () {};
	let eventsReceivedCallback = function () {};

	/* fetchCalendar()
	 * Initiates calendar fetch.
	 */
	const fetchCalendar = function () {

		if (auth) {
			if (auth.method === "bearer") {
				opts.auth = {
					bearer: auth.pass
				};
			} else {
				opts.auth = {
					user: auth.user,
					pass: auth.pass,
					sendImmediately: auth.method !== "digest"
				};
			}
		}

		request(url, opts, function (err, r, requestData) {
			if (err) {
				fetchFailedCallback(self, err);
				scheduleTimer();
				return;
			} else if (r.statusCode !== 200) {
				fetchFailedCallback(self, r.statusCode + ": " + r.statusMessage);
				scheduleTimer();
				return;
			}

			const data = ical.parseICS(requestData);
			const newEvents = [];

			// limitFunction doesn't do much limiting, see comment re: the dates array in rrule section below as to why we need to do the filtering ourselves
			const limitFunction = function (date, i) {
				return true;
			};

			const eventDate = function (event, time) {
				return event[time].length === 8 ? moment(event[time], "YYYYMMDD") : moment(new Date(event[time]));
			};

			Object.entries(data).forEach(([key, event]) => {
				const now = new Date();
				const today = moment().startOf("day").toDate();
				const future = moment().startOf("day").add(maximumNumberOfDays, "days").subtract(1, "seconds").toDate(); // Subtract 1 second so that events that start on the middle of the night will not repeat.
				let past = today;

				if (includePastEvents) {
					past = moment().startOf("day").subtract(maximumNumberOfDays, "days").toDate();
				}

				// FIXME: Ugly fix to solve the facebook birthday issue.
				// Otherwise, the recurring events only show the birthday for next year.
				let isFacebookBirthday = false;
				if (typeof event.uid !== "undefined") {
					if (event.uid.indexOf("@facebook.com") !== -1) {
						isFacebookBirthday = true;
					}
				}

				if (event.type === "VEVENT") {
					let startDate = eventDate(event, "start");
					let endDate;

					if (typeof event.end !== "undefined") {
						endDate = eventDate(event, "end");
					} else if (typeof event.duration !== "undefined") {
						endDate = startDate.clone().add(moment.duration(event.duration));
					} else {
						if (!isFacebookBirthday) {
							endDate = startDate;
						} else {
							endDate = moment(startDate).add(1, "days");
						}
					}

					// calculate the duration of the event for use with recurring events.
					let duration = parseInt(endDate.format("x")) - parseInt(startDate.format("x"));

					if (event.start.length === 8) {
						startDate = startDate.startOf("day");
					}

					const title = getTitleFromEvent(event);

					let excluded = false,
						dateFilter = null;

					for (let f in excludedEvents) {
						let filter = excludedEvents[f],
							testTitle = title.toLowerCase(),
							until = null,
							useRegex = false,
							regexFlags = "g";

						if (filter instanceof Object) {
							if (typeof filter.until !== "undefined") {
								until = filter.until;
							}

							if (typeof filter.regex !== "undefined") {
								useRegex = filter.regex;
							}

							// If additional advanced filtering is added in, this section
							// must remain last as we overwrite the filter object with the
							// filterBy string
							if (filter.caseSensitive) {
								filter = filter.filterBy;
								testTitle = title;
							} else if (useRegex) {
								filter = filter.filterBy;
								testTitle = title;
								regexFlags += "i";
							} else {
								filter = filter.filterBy.toLowerCase();
							}
						} else {
							filter = filter.toLowerCase();
						}

						if (testTitleByFilter(testTitle, filter, useRegex, regexFlags)) {
							if (until) {
								dateFilter = until;
							} else {
								excluded = true;
							}
							break;
						}
					}

					if (excluded) {
						return;
					}

					const location = event.location || false;
					const geo = event.geo || false;
					const description = event.description || false;

					if (typeof event.rrule !== "undefined" && event.rrule !== null && !isFacebookBirthday) {
						const rule = event.rrule;
						let addedEvents = 0;

						const pastMoment = moment(past);
						const futureMoment = moment(future);

						// can cause problems with e.g. birthdays before 1900
						if ((rule.options && rule.origOptions && rule.origOptions.dtstart && rule.origOptions.dtstart.getFullYear() < 1900) || (rule.options && rule.options.dtstart && rule.options.dtstart.getFullYear() < 1900)) {
							rule.origOptions.dtstart.setYear(1900);
							rule.options.dtstart.setYear(1900);
						}

						// For recurring events, get the set of start dates that fall within the range
						// of dates we're looking for.
						// kblankenship1989 - to fix issue #1798, converting all dates to locale time first, then converting back to UTC time
						const pastLocal = pastMoment.subtract(past.getTimezoneOffset(), "minutes").toDate();
						const futureLocal = futureMoment.subtract(future.getTimezoneOffset(), "minutes").toDate();
						const datesLocal = rule.between(pastLocal, futureLocal, true, limitFunction);
						const dates = datesLocal.map(function (dateLocal) {
							return moment(dateLocal).add(dateLocal.getTimezoneOffset(), "minutes").toDate();
						});

						// The "dates" array contains the set of dates within our desired date range range that are valid
						// for the recurrence rule. *However*, it's possible for us to have a specific recurrence that
						// had its date changed from outside the range to inside the range.  For the time being,
						// we'll handle this by adding *all* recurrence entries into the set of dates that we check,
						// because the logic below will filter out any recurrences that don't actually belong within
						// our display range.
						// Would be great if there was a better way to handle this.
						if (event.recurrences !== undefined) {
							for (let r in event.recurrences) {
								// Only add dates that weren't already in the range we added from the rrule so that
								// we don"t double-add those events.
								if (moment(new Date(r)).isBetween(pastMoment, futureMoment) !== true) {
									dates.push(new Date(r));
								}
							}
						}

						// Loop through the set of date entries to see which recurrences should be added to our event list.
						for (let d in dates) {
							const date = dates[d];
							// ical.js started returning recurrences and exdates as ISOStrings without time information.
							// .toISOString().substring(0,10) is the method they use to calculate keys, so we'll do the same
							// (see https://github.com/peterbraden/ical.js/pull/84 )
							const dateKey = date.toISOString().substring(0, 10);
							let curEvent = event;
							let showRecurrence = true;

							startDate = moment(date);

							// For each date that we're checking, it's possible that there is a recurrence override for that one day.
							if (curEvent.recurrences !== undefined && curEvent.recurrences[dateKey] !== undefined) {
								// We found an override, so for this recurrence, use a potentially different title, start date, and duration.
								curEvent = curEvent.recurrences[dateKey];
								startDate = moment(curEvent.start);
								duration = parseInt(moment(curEvent.end).format("x")) - parseInt(startDate.format("x"));
							}
							// If there's no recurrence override, check for an exception date.  Exception dates represent exceptions to the rule.
							else if (curEvent.exdate !== undefined && curEvent.exdate[dateKey] !== undefined) {
								// This date is an exception date, which means we should skip it in the recurrence pattern.
								showRecurrence = false;
							}

							endDate = moment(parseInt(startDate.format("x")) + duration, "x");
							if (startDate.format("x") === endDate.format("x")) {
								endDate = endDate.endOf("day");
							}

							const recurrenceTitle = getTitleFromEvent(curEvent);

							// If this recurrence ends before the start of the date range, or starts after the end of the date range, don"t add
							// it to the event list.
							if (endDate.isBefore(past) || startDate.isAfter(future)) {
								showRecurrence = false;
							}

							if (timeFilterApplies(now, endDate, dateFilter)) {
								showRecurrence = false;
							}

							if (showRecurrence === true) {
								addedEvents++;
								newEvents.push({
									title: recurrenceTitle,
									startDate: startDate.format("x"),
									endDate: endDate.format("x"),
									fullDayEvent: isFullDayEvent(event),
									class: event.class,
									firstYear: event.start.getFullYear(),
									location: location,
									geo: geo,
									description: description
								});
							}
						}
						// end recurring event parsing
					} else {
						// Single event.
						const fullDayEvent = isFacebookBirthday ? true : isFullDayEvent(event);

						if (includePastEvents) {
							// Past event is too far in the past, so skip.
							if (endDate < past) {
								return;
							}
						} else {
							// It's not a fullday event, and it is in the past, so skip.
							if (!fullDayEvent && endDate < new Date()) {
								return;
							}

							// It's a fullday event, and it is before today, So skip.
							if (fullDayEvent && endDate <= today) {
								return;
							}
						}

						// It exceeds the maximumNumberOfDays limit, so skip.
						if (startDate > future) {
							return;
						}

						if (timeFilterApplies(now, endDate, dateFilter)) {
							return;
						}

						// Adjust start date so multiple day events will be displayed as happening today even though they started some days ago already
						if (fullDayEvent && startDate <= today) {
							startDate = moment(today);
						}

						// Every thing is good. Add it to the list.
						newEvents.push({
							title: title,
							startDate: startDate.format("x"),
							endDate: endDate.format("x"),
							fullDayEvent: fullDayEvent,
							class: event.class,
							location: location,
							geo: geo,
							description: description
						});
					}
				}
			});

			newEvents.sort(function (a, b) {
				return a.startDate - b.startDate;
			});

			events = newEvents;

			self.broadcastEvents();
			scheduleTimer();
		});
	};










	/* public methods */

	/* startFetch()
	 * Initiate fetchCalendar();
	 */
	this.startFetch = function () {
		fetchCalendar();
	};

	/* broadcastItems()
	 * Broadcast the existing events.
	 */
	this.broadcastEvents = function () {
		Log.info("Calendar-Fetcher: Broadcasting " + events.length + " events.");
		eventsReceivedCallback(self);
	};

	/* onReceive(callback)
	 * Sets the on success callback
	 *
	 * argument callback function - The on success callback.
	 */
	this.onReceive = function (callback) {
		eventsReceivedCallback = callback;
	};

	/* onError(callback)
	 * Sets the on error callback
	 *
	 * argument callback function - The on error callback.
	 */
	this.onError = function (callback) {
		fetchFailedCallback = callback;
	};

	/* url()
	 * Returns the url of this fetcher.
	 *
	 * return string - The url of this fetcher.
	 */
	this.url = function () {
		return url;
	};

	/* events()
	 * Returns current available events for this fetcher.
	 *
	 * return array - The current available events for this fetcher.
	 */
	this.events = function () {
		return events;
	};
};

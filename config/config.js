/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */
const config = {
  address: "127.0.0.1",
  port: 8080,
  ipAllowlist: [],
  language: "en",
  timeFormat: 24,
  units: "metric",
  modules: [
    {
      module: "helloworld",
      position: "top_left",
      config: {
        text: "hello world",
      },
    },
    {
      module: "error-reporter",
    },
    {
      module: "calendar",
      disabled: true,
    },
    // {
    // 	module: "mm2",
    // 	header: "MM2 Module",
    // 	position: "top_right",
    // },
    // {
    // 	module: "alert",
    // 	disabled: true
    // },
    // {
    // 	module: "updatenotification",
    // 	position: "top_bar",
    // 	disabled: true
    // },
    // {
    // 	module: "clock",
    // 	position: "top_left",
    // 	disabled: true
    // },
    // {
    // 	module: "text",
    // 	position: "top_left",
    // 	config: {
    // 		text: "world"
    // 	}
    // },
    // {
    // 	module: "count",
    // 	position: "top_left"
    // },
    // {
    // 	module: "calendar",
    // 	header: "US Holidays",
    // 	position: "top_left",
    // 	disabled: true,
    // 	config: {
    // 		calendars: [
    // 			{
    // 				symbol: "calendar-check",
    // 				url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics"
    // 			}
    // 		]
    // 	},
    // },
    // {
    // 	module: "compliments",
    // 	position: "lower_third",
    // 	disabled: true
    // },
  ],
};
export default config;

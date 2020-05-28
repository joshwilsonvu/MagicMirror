import { Config } from "../src/core/types";

/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */
const config: Config = {
	port: 8080,
	ipWhitelist: [],
	language: "en",
	timeFormat: 24,
	units: "metric",
	useHttps: false,
	// serverOnly:  true/false/"local" ,
			     // local for armv6l processors, default
			     //   starts serveronly and then starts chrome browser
			     // false, default for all  NON-armv6l devices
			     // true, force serveronly mode, because you want to.. no UI on this device

	modules: [
		{
			module: "helloworld",
			position: "top_left",
			config: {
				text: "hello world"
			}
		}
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
		// 	disabled: false
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
		// 	config: {
		// 		calendars: [
		// 			{
		// 				symbol: "calendar-check",
		// 				url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics"					}
		// 		]
		// 	},
		// 	disabled: true
		// },
		// {
		// 	module: "compliments",
		// 	position: "lower_third",
		// 	disabled: true
		// },
	],

};
export default config;


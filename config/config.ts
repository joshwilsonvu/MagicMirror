import { Config } from "@mm/core";

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
	modules: [
		{
			module: "text",
			position: "top_left",
			header: "Text",
			config: {
				text: "hello world"
			}
		},
		{
			module: "mm2",
			position: "top_right",
			disabled: false,
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


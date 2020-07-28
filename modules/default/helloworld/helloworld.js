/* Magic Mirror
 * Module: HelloWorld
 *
 * By Josh Wilson
 * MIT Licensed.
 */
import React from "react";
import { assignDefaults } from "@mm/core";
/**
 *
 * @param {*} props
 */
export default function HelloWorld(props) {
	const config = assignDefaults(props.config, defaults);
  if (config.escapeHtml) {
		return (
			<div>{config.text}</div>
		)
	} else {
		return (
			<div dangerouslySetInnerHTML={{ __html: config.text }} />
		)
	}
}

const defaults = {
	text: "Hello World!",
	escapeHtml: false
}
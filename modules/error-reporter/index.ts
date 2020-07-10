import { useEffect } from "react";
import { sendSocketNotification, Props } from "@mm/core";


export default function ErrorReporter({ name }: Props) {
  const emit = sendSocketNotification(name);
  useEffect(() => {
    function reporter(event: ErrorEvent) {
      const payload = {
        message: event.message,
        filename: event.filename || "unknown",
        lineno: event.lineno || 1
      }
      console.log("reporting error", payload.message)
      emit("error", payload);
      return true;
    }
    window.addEventListener("error", reporter);
    return () => window.removeEventListener("error", reporter);
  }, [sendSocketNotification]);
  return null;
}
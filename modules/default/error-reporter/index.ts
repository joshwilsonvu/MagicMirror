import { useEffect } from "react";
import { sendSocketNotification, Props } from "magicmirror";

export default function ErrorReporter({ name }: Props) {
  useEffect(() => {
    function reporter(event: ErrorEvent) {
      const payload = {
        message: event.message,
        filename: event.filename || "unknown",
        lineno: event.lineno || 1
      }
      console.log("reporting error", payload.message)
      sendSocketNotification(name, "error", payload);
      return true;
    }
    window.addEventListener("error", reporter);
    return () => window.removeEventListener("error", reporter);
  }, [name]);
  return null;
}

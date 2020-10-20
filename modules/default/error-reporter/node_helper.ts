import NodeHelper from "magicmirror/node-helper";

export default class ErrorReporter extends NodeHelper {
  onError(event) {
    console.error(`Client error at ${event.filename}:${event.lineno}: ${event.message}`);
  }

  start() {
    this.on("error", this.onError);
  }

  stop() {
    this.off("error", this.onError);
  }

  socketNotificationReceived() {}
}

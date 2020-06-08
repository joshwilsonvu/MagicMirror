/* global Module */

Module.register("mm2", {
  start() {
    console.log(this.name);
  },
  init() {
    console.log("init", this)
  }
})
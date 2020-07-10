/* global Module */

Module.register("mm2", {
  start() {
    console.log(this.name);
  },
  init() {
    console.log("init", this)
  },
  async getDom() {
    const e = document.createElement.bind(document);
    const wrapper = e("div");
    const p = e("p");
    p.append("Hello from MM2 Module");
    wrapper.appendChild(p);
    return wrapper;
  }
})
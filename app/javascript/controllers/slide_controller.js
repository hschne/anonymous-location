import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="slide"
export default class extends Controller {
  static targets = ["button", "content"];

  toggle() {
    console.log(this.expanded);
    const height = this.contentTarget.offsetHeight;
    const rem =
      height / parseFloat(getComputedStyle(document.documentElement).fontSize) +
      1;
    if (this.collapsed) {
      this.element.style.transform = "";
      this.collapsed = false;
    } else {
      this.element.style.transform = `translate(-50%, ${rem}rem)`;
      this.collapsed = true;
    }
    this.buttonTarget.classList.toggle("rotate-180");
  }

  connect() {}
}

import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="slide"
export default class extends Controller {
  static targets = ["button", "content"];

  toggle() {
    const height = this.contentTarget.offsetHeight;
    const rem =
      height / parseFloat(getComputedStyle(document.documentElement).fontSize) +
      1; // Add bottom padding
    console.log(rem);
    this.element.classList.toggle(`translate-y-[${rem}rem]`);
    this.buttonTarget.classList.toggle("rotate-180");
  }

  connect() {}
}

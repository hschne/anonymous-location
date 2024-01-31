import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="slide"
export default class extends Controller {
  static targets = ["button"];

  toggle() {
    this.element.classList.toggle("collapsed");
    this.buttonTarget.classList.toggle("rotate-180");
  }

  connect() {}
}

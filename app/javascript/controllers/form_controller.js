import { Controller } from "@hotwired/stimulus";

const LOCATION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

export default class extends Controller {
  connect() {}

  submit(e) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const form = this.element;
        form.disabled = true;
        this.element.querySelector("#client_coordinates").value =
          `${position.coords.longitude},${position.coords.latitude}`;
        Turbo.navigator.submitForm(form);
      },
      (err) => this.error(err),
      LOCATION_OPTIONS,
    );
  }

  onError() {
    document.querySelector("#flash").innerHtml =
      "You must enable location sharing, else this won't work!";
  }
}

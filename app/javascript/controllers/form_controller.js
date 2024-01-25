import { Controller } from "@hotwired/stimulus";

const LOCATION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

export default class extends Controller {
  static targets = ["spinner"];
  static outlets = ["map"];
  connect() {}

  colorSelected() {
    const form = this.element;
    const radioButtons = form.querySelectorAll("input[type=radio]:checked");
    const submit = form.querySelector("#share_position_submit");
    if (radioButtons.length > 0) {
      submit.disabled = false;
    } else {
      submit.disabled = true;
    }
  }

  submit(e) {
    e.preventDefault();

    this.spinnerTarget.classList.remove("hidden");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        navigator.geolocation.watchPosition(
          (pos) => {
            console.log(pos.coords.longitude, pos.coords.latitude);
            this.mapOutlet.sendCoordinates(
              `${pos.coords.longitude},${pos.coords.latitude}`,
            );
          },
          (error) => console.log(error),
          LOCATION_OPTIONS,
        );
        this.setCoordinatesAndSubmit(
          `${position.coords.longitude},${position.coords.latitude}`,
        );
      },
      (err) => this.error(err),
      LOCATION_OPTIONS,
    );
  }

  error(err) {
    this.setCoordinatesAndSubmit("");
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  setCoordinatesAndSubmit(coordinates) {
    const form = this.element;
    form.disabled = true;
    this.element.querySelector("#client_coordinates").value = coordinates;
    this.spinnerTarget.classList.add("hidden");
    Turbo.navigator.submitForm(form);
  }
}

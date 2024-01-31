import { Controller } from "@hotwired/stimulus";

const MAP_OPTIONS = {
  zoom: 15,
  style: "740f0993-613e-4b3c-9781-4bd6820bd081",
  geolocateControl: false,
  navigationControl: false,
};

export default class extends Controller {
  static targets = ["form"];

  static values = { apiKey: String };

  connect() {
    maptilersdk.config.apiKey = this.apiKeyValue;
    const map = new maptilersdk.Map({
      ...MAP_OPTIONS,
      container: this.element,
      geolocate: maptilersdk.GeolocationType.COUNTRY,
    });
    map.on("load", () => {
      document.querySelector("#spinner").remove();
    });

    const markers = [];
    const locationField = this.formTarget.querySelector("#location_location");
    const submitButtom = this.formTarget.querySelector("#new_map_submit");
    map.on("click", async (e) => {
      markers.forEach((marker) => marker.remove());
      const map = e.target;
      const marker = new maptilersdk.Marker({
        color: "#000",
        draggable: true,
      }).setLngLat(e.lngLat);
      marker.on("dragend", (e) => {
        locationField.value = `${e.target._lngLat.lng},${e.target._lngLat.lat}`;
      });
      markers.push(marker);
      marker.addTo(map);
      locationField.value = `${e.lngLat.lng},${e.lngLat.lat}`;
      if (locationField.value != "") {
        submitButtom.disabled = false;
      }
    });
  }
}

import { Controller } from "@hotwired/stimulus";
import L from "leaflet";

// Connects to data-controller="maps"
export default class extends Controller {
  static targets = ["container", "mapContainer"];

  connect() {
    this.map = L.map(this.mapContainerTarget);
    const tiles = L.tileLayer(
      "https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=CV0ZSLFSeTgHr5Pq8Y6U",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    );
    this.map.addLayer(tiles);
    this.map
      .locate({
        setView: true,
        maxZoom: 19,
        enableHighAccuracy: true,
        maximumAge: 0,
      })
      .on("locationerror", this.onLocationError);
  }

  setLocation() {}

  onLocationError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    // Hack, properly remove map
    // document.querySelector("#map").innerHTML = `ERROR(${err.code}): ${err.message}`;
  }

  disconnect() {
    this.map.remove();
  }
}

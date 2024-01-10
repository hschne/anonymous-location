import { Controller } from "@hotwired/stimulus";
import L from "leaflet";

// Connects to data-controller="maps"
export default class extends Controller {
  static targets = ["container"];

  connect() {
    var map = L.map(this.containerTarget).setView([48.210033, 16.363449], 12);

    L.tileLayer(
      "https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=CV0ZSLFSeTgHr5Pq8Y6U",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    ).addTo(map);
  }

  disconnect() {
    this.map.remove();
  }
}

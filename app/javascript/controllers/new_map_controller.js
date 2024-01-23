import { Controller } from "@hotwired/stimulus";

const MAP_OPTIONS = {
  zoom: 15,
  style: "740f0993-613e-4b3c-9781-4bd6820bd081",
  geolocateControl: false,
  navigationControl: false,
};

export default class extends Controller {
  static targets = ["locationInput"];

  connect() {
    maptilersdk.config.apiKey = "CV0ZSLFSeTgHr5Pq8Y6U";

    const map = new maptilersdk.Map({
      ...MAP_OPTIONS,
      container: this.element,
      geolocate: maptilersdk.GeolocationType.POINT,
    });

    // const nav = new maptilersdk.MaptilerNavigationControl({
    //   showCompass: false,
    //   visualizePitch: false,
    //   showZoom: false,
    // });
    // map.addControl(nav, "top-right");
    //
    // const gc = new maptilersdkMaptilerGeocoder.GeocodingControl({
    //   limit: 5,
    // });
    // map.addControl(gc, "top-left");

    const markers = [];
    map.on("click", async (e) => {
      markers.forEach((marker) => marker.remove());
      const map = e.target;
      const marker = new maptilersdk.Marker({
        color: "#000",
        draggable: true,
      }).setLngLat(e.lngLat);
      markers.push(marker);
      marker.addTo(map);
      this.locationInputTarget.value = `${e.lngLat.lng},${e.lngLat.lat}`;
    });
  }
}

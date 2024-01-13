import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["map", "locationInput"];

  connect() {
    maptilersdk.config.apiKey = "CV0ZSLFSeTgHr5Pq8Y6U";

    const map = new maptilersdk.Map({
      container: this.element,
      style: maptilersdk.MapStyle.BASIC,
      geolocate: maptilersdk.GeolocationType.POINT,
      geolocateControl: false,
      navigationControl: false,
    });
    map.touchPitch.disable();

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

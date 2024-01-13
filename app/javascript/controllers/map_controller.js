import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    maptilersdk.config.apiKey = "CV0ZSLFSeTgHr5Pq8Y6U";

    const map = new maptilersdk.Map({
      container: this.element,
      style: maptilersdk.MapStyle.BASIC,
      geolocate: maptilersdk.GeolocationType.POINT,
      navigationControl: false,
    });
    map.touchPitch.disable();

    const nav = new maptilersdk.MaptilerNavigationControl({
      showCompass: false,
      visualizePitch: false,
      showZoom: false,
    });
    map.addControl(nav, "top-right");

    const gc = new maptilersdkMaptilerGeocoder.GeocodingControl({
      limit: 5,
    });
    map.addControl(gc, "top-left");

    map.on("load", () => {
      map.addSource("search-results", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      map.addLayer({
        id: "point-result",
        type: "circle",
        source: "search-results",
        paint: {
          "circle-radius": 8,
          "circle-color": "#B42222",
          "circle-opacity": 0.5,
        },
        filter: ["==", "$type", "Point"],
      });
    });

    const markers = [];
    map.on("click", async (e) => {
      markers.forEach((marker) => marker.remove());
      const map = e.target;
      const marker = new maptilersdk.Marker({
        color: "#FFFFFF",
        draggable: true,
      }).setLngLat(e.lngLat);
      markers.push(marker);
      marker.addTo(map);
    });
  }

  fitBounds() {
    this.map.fitBounds([this.bbox], { maxZoom: 19 });
  }
}

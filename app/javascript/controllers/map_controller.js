import { Controller } from "@hotwired/stimulus";
import consumer from "../channels/consumer";

const MAP_OPTIONS = {
  zoom: 15,
  style: "740f0993-613e-4b3c-9781-4bd6820bd081",
  geolocateControl: false,
  navigationControl: false,
};

const MARKER_OPTIONS = {
  draggable: false,
};

export default class extends Controller {
  static values = {
    key: String,
    location: String,
    uuid: String,
    clients: Array,
  };

  connect() {
    maptilersdk.config.apiKey = "CV0ZSLFSeTgHr5Pq8Y6U";

    this.markers = {};
    this.connectToChannel();
  }

  connectToChannel() {
    this.subscription = consumer.subscriptions.create(
      {
        channel: "LocationChannel",
        key: this.keyValue,
      },
      {
        connected: this._connected.bind(this),
        disconnected: this._disconnected.bind(this),
        received: this._received.bind(this),
      },
    );
  }

  _connected() {
    this.initializeMap();
  }

  _disconnected() {}

  _received(data) {
    console.log("Received...");
    console.log(data);
    const { uuid, coordinates } = data;
    if (data.event === "clientDisconnected") {
      if (!this.markers[uuid]) return;

      this.markers[uuid].remove();
      delete this.markers[uuid];
    } else if (data.event == "clientConnected") {
      if (this.markers[uuid]) return;

      this.addClientMarker(data);
    } else {
      if (!this.markers[uuid]) return;

      this.markers[uuid].setLngLat(coordinates.split(","));
    }
  }

  initializeMap() {
    this.map = new maptilersdk.Map({
      ...MAP_OPTIONS,
      container: this.element,
      center: this.locationValue.split(","),
    });
    this.addLocationMarker();
    this.addClientMarkers();
  }

  addLocationMarker() {
    const marker = new maptilersdk.Marker({
      color: "#000",
      draggable: false,
    }).setLngLat(this.locationValue.split(","));
    marker.addTo(this.map);
  }

  addClientMarkers() {
    this.clientsValue.forEach((client) => {
      const { uuid, color, coordinates } = client;
      this.addClientMarker({ uuid, color, coordinates });
    });
  }

  addClientMarker({ uuid, color, coordinates }) {
    const marker = new maptilersdk.Marker({
      ...MARKER_OPTIONS,
      color,
    }).setLngLat(coordinates.split(","));
    if (uuid === this.uuidValue) {
      marker.setPopup(
        new maptilersdk.Popup().setHTML("&lt;h1&gt;Hello World!&lt;/h1&gt;"),
      );
    }
    marker.addTo(this.map);
    this.markers[uuid] = marker;
  }
}

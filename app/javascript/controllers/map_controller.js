import { Controller } from "@hotwired/stimulus";
import consumer from "../channels/consumer";

const LOCATION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

const MAP_OPTIONS = {
  zoom: 15,
  style: maptilersdk.MapStyle.BASIC,
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
    console.log("Connecting...");
    console.log(this.keyValue);
    console.log(this.uuidValue);
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

  _connected({ reconnected }) {
    console.log("Connected...");
    if (reconnected) {
      console.log("Reconnected...");
    }
    this.initializeMap();
  }

  _disconnected() {
    console.log("Disconnected...");
    const event = new CustomEvent("channel-disconnected");
    window.dispatchEvent(event);
  }

  _received(data) {
    console.log("Received...");
    console.log(data);
    const { uuid, coordinates } = data;
    if (data.event === "clientDisconnected") {
      this.markers[uuid].remove();
      delete this.markers[uuid];
    } else if (data.event == "clientConnected") {
      this.addClientMarker(data);
    } else {
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
      color: "#fff",
      draggable: false,
    }).setLngLat(this.locationValue.split(","));
    marker.addTo(this.map);
  }

  addClientMarkers() {
    this.clientsValue.forEach((client) => {
      const { uuid, color, coordinates } = JSON.parse(client);
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

  addMyLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.sendPosition(position);
      },
      (err) => this.error(err),
      LOCATION_OPTIONS,
    );
  }

  sendPosition(pos) {
    const { latitude, longitude } = pos.coords;
    this.subscription.perform("appear", {
      uuid: this.uuidValue,
      name: "CODENAME",
      color: "#0000ff",
      coordinates: `${longitude},${latitude}`,
    });
  }

  positionsChanged(pos) {
    const { latitude, longitude } = pos.coords;
    this.subscription.perform("changed", {
      uuid: this.uuidValue,
      name: "CODENAME",
      color: "#0000ff",
      coordinates: `${longitude},${latitude}`,
    });
  }

  error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
  }
}

import { Controller } from "@hotwired/stimulus";
import consumer from "../channels/consumer";

const LOCATION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

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
      color: "#fff",
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

  shareLocation(e) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const form = e.target;
        form.disabled = true;
        form.classList.toggle("hidden");
        this.sendPosition(position, e.target);
      },
      (err) => this.error(err),
      LOCATION_OPTIONS,
    );
    e.preventDefault();
  }

  sendPosition(pos, form) {
    const { latitude, longitude } = pos.coords;
    const name = form.querySelector("#client_name").value;
    const color = form.querySelector("#client_color").value;
    this.subscription.perform("appear", {
      uuid: this.uuidValue,
      name: name,
      color: color,
      coordinates: `${longitude},${latitude}`,
    });
  }

  error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
  }
}

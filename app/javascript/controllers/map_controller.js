import { Controller } from "@hotwired/stimulus";
import consumer from "../channels/consumer";

export default class extends Controller {
  static values = {
    key: String,
    client: String,
    location: String,
  };

  connect() {
    maptilersdk.config.apiKey = "CV0ZSLFSeTgHr5Pq8Y6U";

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
    console.log(data);

    console.log("Location updated...");
    const event = new CustomEvent("location-changed");
    window.dispatchEvent(event, data);
  }

  initializeMap() {
    this.map = new maptilersdk.Map({
      container: this.element,
      center: this.locationValue.split(","),
      zoom: 15,
      style: maptilersdk.MapStyle.BASIC,
      geolocateControl: false,
      navigationControl: false,
    });
    this.addLocationMarker();

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.sendPosition(position);
        this.addClientMarker(position);
      },
      (err) => this.error(err),
      options,
    );
  }

  addLocationMarker() {
    const marker = new maptilersdk.Marker({
      color: "#fff",
      draggable: false,
    }).setLngLat(this.locationValue.split(","));
    marker.addTo(this.map);
  }

  addClientMarker(pos) {
    console.log(pos);
    console.log(pos.coords);
    const marker = new maptilersdk.Marker({
      color: "#ff0000",
      draggable: false,
    }).setLngLat([pos.coords.longitude, pos.coords.latitude]);
    marker.addTo(this.map);
  }

  sendPosition(pos) {
    this.subscription.send({
      client: this.clientValue,
      location: pos.coords,
    });
  }

  error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
  }
}

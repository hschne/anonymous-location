import { Controller } from "@hotwired/stimulus";
import { createConsumer } from "@rails/actioncable";

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
    name: String,
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
    this.subscription = createConsumer().subscriptions.create(
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

  sendCoordinates(coordinates) {
    this.subscription.send({ uuid: this.uuidValue, coordinates: coordinates });
  }

  _connected() {
    this.initializeMap();
  }

  _disconnected() {}

  _received(data) {
    console.log("Received...");
    console.log(data);
    const { uuid, coordinates } = data;
    console.log(data.event);
    if (data.event === "clientDisconnected") {
      if (!this.markers[uuid]) return;

      this.markers[uuid].remove();
      delete this.markers[uuid];
    } else if (data.event == "clientConnected") {
      if (this.markers[uuid]) return;
      this.addClientMarker(data);
    } else if (data.event == "locationDestroyed") {
      window.location.replace("/locations/expired");
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

    this.map.on("load", () => {
      document.querySelector("#spinner").remove();
    });

    this.addLocationMarker();
    this.addClientMarkers();
  }

  addLocationMarker() {
    const markerHeight = 50,
      markerRadius = 10,
      linearOffset = 25;
    const popupOffsets = {
      top: [0, 0],
      "top-left": [0, 0],
      "top-right": [0, 0],
      bottom: [0, -markerHeight],
      "bottom-left": [
        linearOffset,
        (markerHeight - markerRadius + linearOffset) * -1,
      ],
      "bottom-right": [
        -linearOffset,
        (markerHeight - markerRadius + linearOffset) * -1,
      ],
      left: [markerRadius, (markerHeight - markerRadius) * -1],
      right: [-markerRadius, (markerHeight - markerRadius) * -1],
    };
    new maptilersdk.Popup({
      offset: popupOffsets,
      closeButton: false,
      closeOnClick: false,
      className: "popup",
    })
      .setLngLat(this.locationValue.split(","))
      .setHTML(this.nameValue)
      .setMaxWidth("300px")
      .addTo(this.map);
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

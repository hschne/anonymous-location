import { Controller } from "@hotwired/stimulus";
import consumer from "../channels/consumer";

export default class extends Controller {
  static targets = ["locationInput"];

  connect() {
    maptilersdk.config.apiKey = "CV0ZSLFSeTgHr5Pq8Y6U";

    const map = new maptilersdk.Map({
      container: this.element,
      style: maptilersdk.MapStyle.BASIC,
      geolocate: maptilersdk.GeolocationType.POINT,
      geolocateControl: false,
      navigationControl: false,
    });

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(
      (position) => console.log(position),
      this.error,
      options,
    );
    this.connectToChannel();
  }

  updatePosition(pos) {
    console.log(pos.coords);
    this.locationChannel.send({
      sent_by: "Paul",
      body: "This is a cool chat app.",
    });
  }

  connectToChannel() {
    this.locationChannel = consumer.subscriptions.create(
      {
        channel: "LocationChannel",
        key: this.keyValue,
      },
      {
        connected() {
          console.log("Connected...");
        },
        disconnected() {
          console.log("Disconnected...");
          const event = new CustomEvent("channel-disconnected");
          window.dispatchEvent(event);
        },
        received(data) {
          console.log("Location updated...");
          const event = new CustomEvent("location-changed");
          window.dispatchEvent(event, data);
        },
      },
    );
  }

  error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
  }
}

// export default class extends Controller {
//   connect() {
//     console.log("Map controller connected...");
//     maptilersdk.config.apiKey = "CV0ZSLFSeTgHr5Pq8Y6U";
//     this.map = new maptilersdk.Map({
//       container: this.element,
//       style: maptilersdk.MapStyle.BASIC,
//       geolocate: maptilersdk.GeolocationType.POINT,
//       geolocateControl: false,
//       navigationControl: false,
//     });
//
//   }
//
//
//   error(err) {
//     console.error(`ERROR(${err.code}): ${err.message}`);
//   }
//
//   }
// }

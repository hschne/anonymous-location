import consumer from "channels/consumer";

consumer.subscriptions.create("LocationChannel", {
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
});

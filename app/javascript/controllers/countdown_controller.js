import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = {
    expiresAt: String,
  };

  connect() {
    var countDownDate = new Date(this.expiresAtValue).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const minutes = Math.floor(distance / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      const prefixZero = (number) => {
        return number < 10 ? "0" + number : number;
      };
      if (distance < 30 * 1000) {
        this.element.classList.add("text-red-500");
      }
      this.element.innerHTML = `${prefixZero(minutes)}:${prefixZero(seconds)}`;
      if (distance < 0) {
        clearInterval(timer);
        this.element.innerHTML = "00:00";
      }
    }, 1000);
  }

  prefixZero(number) {}
}

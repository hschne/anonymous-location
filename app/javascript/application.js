// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";

document.addEventListener("turbo:before-stream-render", function (event) {
  // See https://edforshaw.co.uk/hotwire-turbo-stream-animations
  if (event.target.firstElementChild instanceof HTMLTemplateElement) {
    var enterAnimationClass =
      event.target.firstElementChild.dataset.streamEnterClass;
    if (enterAnimationClass) {
      event.target.content.firstElementChild.classList.add(enterAnimationClass);
    }
  }

  var elementToRemove = document.getElementById(event.target.target);
  if (elementToRemove) {
    var streamExitClass = elementToRemove.dataset.streamExitClass;
    if (streamExitClass) {
      // Intercept the removal of the element
      event.preventDefault();
      elementToRemove.classList.add(streamExitClass);
      // Wait for its animation to end before removing the element
      elementToRemove.addEventListener("animationend", function () {
        event.target.performAction();
      });
    }
  }
});

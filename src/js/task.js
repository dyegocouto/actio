import { DOM } from "./DOM.js";

if (DOM.openTaskModal) {
  DOM.openTaskModal.addEventListener("click", () => {
    DOM.taskModal?.showModal();
  });
}

if (DOM.cancelTask) {
  DOM.cancelTask.addEventListener("click", (event) => {
    event.preventDefault();
    DOM.taskModal?.close();
  });
}

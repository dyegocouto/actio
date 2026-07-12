import { DOM } from "./DOM.js";

if (DOM.openTaskModal) {
  DOM.openTaskModal.addEventListener("click", () => {
    DOM.taskModal?.showModal();
  });
}

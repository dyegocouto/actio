import { DOM } from "./DOM.js";

if (DOM.openProjModal) {
  DOM.openProjModal.addEventListener("click", () => {
    DOM.projForm?.reset();
    DOM.projModal?.showModal();
  });
}

DOM.cancelProj?.addEventListener("click", () => {
  DOM.projModal?.close();
});

DOM.projForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = DOM.projTitle?.value.trim();
  if (!title || !DOM.projectList) return;

  const project = document.createElement("li");
  project.className = "project";
  project.textContent = title;
  DOM.projectList.append(project);

  DOM.projModal?.close();
});

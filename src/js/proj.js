import { DOM } from "./DOM.js";
import { addProject, getProjects } from "./proj-store.js";

function renderProject(title) {
  const project = document.createElement("li");
  project.className = "project";
  project.textContent = title;
  DOM.projectList?.append(project);
}

getProjects().forEach(renderProject);

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

  addProject(title);
  renderProject(title);

  DOM.projModal?.close();
});

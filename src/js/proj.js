import { DOM } from "./DOM.js";
import {
  addProject,
  getProjects,
  removeProject,
  renameProject,
} from "./proj-store.js";
import { removeProjectTasks, renameProjectTasks } from "./task-store.js";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";

let projectBeingEdited = null;

function renderProject(title, isActive = false) {
  const project = document.createElement("li");
  project.className = `project${isActive ? " project--active" : ""}`;
  const projectTitle = document.createElement("span");
  projectTitle.className = "project__title";
  projectTitle.textContent = title;

  const actions = document.createElement("span");
  actions.className = "project-actions";

  [
    ["edit-project", "Edit", editIcon],
    ["delete-project", "Delete", deleteIcon],
  ].forEach(([action, label, icon]) => {
    const button = document.createElement("button");
    button.className = `project-action${action === "delete-project" ? " project-action--delete" : ""}`;
    button.type = "button";
    button.dataset.action = action;
    button.setAttribute("aria-label", `${label} ${title}`);

    const image = document.createElement("img");
    image.src = icon;
    image.alt = "";
    button.append(image);
    actions.append(button);
  });

  project.append(projectTitle, actions);
  DOM.projectList?.append(project);
}

getProjects().forEach((title, index) => renderProject(title, index === 0));

function resetProjectModal() {
  projectBeingEdited = null;
  DOM.projForm?.reset();
  const modalTitle = DOM.projModal?.querySelector(".modal-title");
  const saveButton = DOM.projModal?.querySelector(".save-modal");
  if (modalTitle) modalTitle.textContent = "New Project";
  if (saveButton) saveButton.textContent = "Save Project";
}

if (DOM.openProjModal) {
  DOM.openProjModal.addEventListener("click", () => {
    resetProjectModal();
    DOM.projModal?.showModal();
  });
}

DOM.cancelProj?.addEventListener("click", () => {
  DOM.projModal?.close();
});

DOM.projModal?.addEventListener("close", resetProjectModal);

DOM.projForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = DOM.projTitle?.value.trim();
  if (!title || !DOM.projectList) return;

  if (projectBeingEdited) {
    const wasActive = projectBeingEdited.classList.contains("project--active");
    const previousTitle =
      projectBeingEdited.querySelector(".project__title").textContent;
    renameProject(previousTitle, title);
    renameProjectTasks(previousTitle, title);
    projectBeingEdited.querySelector(".project__title").textContent = title;
    projectBeingEdited.querySelectorAll(".project-action").forEach((button) => {
      const action =
        button.dataset.action === "edit-project" ? "Edit" : "Delete";
      button.setAttribute("aria-label", `${action} ${title}`);
    });
    if (wasActive) {
      document.dispatchEvent(
        new CustomEvent("projectchange", { detail: { projectId: title } }),
      );
    }
  } else {
    addProject(title);
    renderProject(title);
  }

  DOM.projModal?.close();
});

DOM.projectList?.addEventListener("click", (event) => {
  const actionButton = event.target.closest(".project-action");
  if (!actionButton) return;

  const project = actionButton.closest(".project");
  const title = project?.querySelector(".project__title")?.textContent;
  if (!project || !title) return;

  if (actionButton.dataset.action === "edit-project") {
    projectBeingEdited = project;
    DOM.projTitle.value = title;
    const modalTitle = DOM.projModal?.querySelector(".modal-title");
    const saveButton = DOM.projModal?.querySelector(".save-modal");
    if (modalTitle) modalTitle.textContent = "Edit Project";
    if (saveButton) saveButton.textContent = "Save Changes";
    DOM.projModal?.showModal();
    return;
  }

  const wasActive = project.classList.contains("project--active");
  removeProject(title);
  removeProjectTasks(title);
  project.remove();

  if (wasActive) {
    const nextProject = DOM.projectList.querySelector(".project");
    if (nextProject) nextProject.click();
  }
});

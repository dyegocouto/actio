const projectList = document.querySelector(".project-list");

export function getActiveProjectId() {
  return projectList?.querySelector(".project--active")?.textContent.trim();
}

function setActiveProject(projectItem) {
  projectList
    .querySelectorAll(".project.project--active")
    .forEach((item) => item.classList.remove("project--active"));

  projectItem.classList.add("project--active");
  document.dispatchEvent(
    new CustomEvent("projectchange", { detail: { projectId: getActiveProjectId() } }),
  );
}

if (projectList) {
  projectList.addEventListener("click", (event) => {
    if (event.target.closest(".project-action")) return;

    const projectItem = event.target.closest(".project");

    if (!projectItem || !projectList.contains(projectItem)) {
      return;
    }

    setActiveProject(projectItem);
  });
}

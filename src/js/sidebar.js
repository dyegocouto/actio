const projectList = document.querySelector(".project-list");

if (projectList) {
  projectList.addEventListener("click", (event) => {
    const projectItem = event.target.closest(".project");

    if (!projectItem || !projectList.contains(projectItem)) {
      return;
    }

    projectList
      .querySelectorAll(".project.project--active")
      .forEach((item) => item.classList.remove("project--active"));

    projectItem.classList.add("project--active");
  });
}

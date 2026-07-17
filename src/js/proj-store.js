const STORAGE_KEY = "actio-projects";
const DEFAULT_PROJECTS = ["Default"];

function readProjects() {
  try {
    const storedProjects = localStorage.getItem(STORAGE_KEY);
    if (storedProjects === null) return null;

    const projects = JSON.parse(storedProjects);
    return Array.isArray(projects) ? projects : [];
  } catch {
    return null;
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProjects() {
  const projects = readProjects();
  return projects ?? DEFAULT_PROJECTS;
}

export function addProject(title) {
  const projects = getProjects();
  projects.push(title);
  saveProjects(projects);
}

export function renameProject(previousTitle, title) {
  const projects = getProjects();
  const projectIndex = projects.indexOf(previousTitle);

  if (projectIndex === -1) return;

  projects[projectIndex] = title;
  saveProjects(projects);
}

export function removeProject(title) {
  saveProjects(getProjects().filter((project) => project !== title));
}

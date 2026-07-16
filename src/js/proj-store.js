const STORAGE_KEY = "actio-projects";

function readProjects() {
  try {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(projects) ? projects : [];
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProjects() {
  return readProjects();
}

export function addProject(title) {
  const projects = readProjects();
  projects.push(title);
  saveProjects(projects);
}

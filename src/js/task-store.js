const STORAGE_KEY = "actio-project-tasks";

function readTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveTasks(tasksByProject) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksByProject));
}

export function getTasks(projectId) {
  return readTasks()[projectId] || [];
}

export function addTask(projectId, task) {
  const tasksByProject = readTasks();
  const tasks = tasksByProject[projectId] || [];

  tasks.push({ id: crypto.randomUUID(), completed: false, ...task });
  tasksByProject[projectId] = tasks;
  saveTasks(tasksByProject);
}

export function updateTask(projectId, taskId, changes) {
  const tasksByProject = readTasks();
  const tasks = tasksByProject[projectId] || [];
  const task = tasks.find(({ id }) => id === taskId);

  if (!task) return;

  Object.assign(task, changes);
  saveTasks(tasksByProject);
}

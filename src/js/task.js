import { DOM } from "./DOM.js";
import { getActiveProjectId } from "./sidebar.js";
import { addTask, getTasks, removeTask, updateTask } from "./task-store.js";

function createTaskCard({ id, title, description, dueDate, priority, completed }) {
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";
  taskCard.dataset.taskId = id;

  const taskContent = document.createElement("div");
  taskContent.className = "task-content";

  const completion = document.createElement("input");
  completion.type = "checkbox";
  completion.name = "task-completion";
  completion.checked = completed;

  const taskInfo = document.createElement("div");
  taskInfo.className = "task-info";

  const taskHeader = document.createElement("div");
  taskHeader.className = "task-header";

  const taskTitle = document.createElement("h4");
  taskTitle.className = "task-title";
  taskTitle.textContent = title;

  const taskPriority = document.createElement("span");
  taskPriority.className = "task-priority";
  taskPriority.textContent = priority;

  const taskDescription = document.createElement("p");
  taskDescription.className = "task-description";
  taskDescription.textContent = description;
  taskDescription.hidden = !description;

  const taskDueDate = document.createElement("div");
  taskDueDate.className = "due-date";
  taskDueDate.textContent = dueDate || "No due date";

  const taskActions = document.createElement("div");
  taskActions.className = "task-actions";
  taskActions.innerHTML =
    '<button class="edit-task">Edit</button><button class="remove-task">Remove</button>';

  taskHeader.append(taskTitle, taskPriority);
  taskInfo.append(taskHeader, taskDescription, taskDueDate);
  taskContent.append(completion, taskInfo);
  taskCard.append(taskContent, taskActions);

  return taskCard;
}

function updateTaskSummary(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  const inProgress = tasks.length - completed;

  if (DOM.taskCount) DOM.taskCount.textContent = `You have ${inProgress} task(s) to complete.`;
  if (DOM.completedCount) DOM.completedCount.textContent = completed;
  if (DOM.inProgressCount) DOM.inProgressCount.textContent = inProgress;
}

function renderTasks(projectId = getActiveProjectId()) {
  if (!DOM.taskContainer || !projectId) return;

  const tasks = getTasks(projectId);
  DOM.taskContainer.replaceChildren(...tasks.map(createTaskCard));
  updateTaskSummary(tasks);
}

if (DOM.openTaskModal) {
  DOM.openTaskModal.addEventListener("click", () => {
    DOM.taskModal?.showModal();
  });
}

if (DOM.cancelTask) {
  DOM.cancelTask.addEventListener("click", (event) => {
    event.preventDefault();
    DOM.taskForm?.reset();
    DOM.taskModal?.close();
  });
}

if (DOM.taskForm && DOM.taskContainer) {
  DOM.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(DOM.taskForm);
    const title = DOM.taskForm.querySelector("#task-title")?.value.trim();

    if (!title) {
      DOM.taskForm.querySelector("#task-title")?.focus();
      return;
    }

    const projectId = getActiveProjectId();
    if (!projectId) return;

    addTask(projectId, {
      title,
      description: formData.get("task-description")?.trim() || "",
      dueDate: formData.get("due-date") || "",
      priority: formData.get("priority") || "medium",
    });

    DOM.taskForm.reset();
    DOM.taskModal?.close();
    renderTasks(projectId);
  });
}

DOM.taskContainer?.addEventListener("change", (event) => {
  const completion = event.target.closest("input[name='task-completion']");
  const taskId = completion?.closest(".task-card")?.dataset.taskId;
  const projectId = getActiveProjectId();

  if (!completion || !taskId || !projectId) return;

  updateTask(projectId, taskId, { completed: completion.checked });
  renderTasks(projectId);
});

DOM.taskContainer?.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-task");
  const taskId = removeButton?.closest(".task-card")?.dataset.taskId;
  const projectId = getActiveProjectId();

  if (!removeButton || !taskId || !projectId) return;

  removeTask(projectId, taskId);
  renderTasks(projectId);
});

document.addEventListener("projectchange", (event) => renderTasks(event.detail.projectId));

renderTasks();

import { DOM } from "./DOM.js";
import { getActiveProjectId } from "./sidebar.js";
import { addTask, getTasks, removeTask, updateTask } from "./task-store.js";

let taskBeingEdited = null;

function resetTaskModal() {
  taskBeingEdited = null;
  DOM.taskForm?.reset();
  const modalTitle = DOM.taskModal?.querySelector(".modal-title");
  const saveButton = DOM.taskForm?.querySelector(".save-task");

  if (modalTitle) modalTitle.textContent = "New Task";
  if (saveButton) saveButton.textContent = "Save Task";
}

function openTaskModalForNewTask() {
  resetTaskModal();
  DOM.taskModal?.showModal();
}

function openTaskModalForEdit(task, projectId) {
  taskBeingEdited = { id: task.id, projectId };

  const form = DOM.taskForm;
  if (!form) return;

  form.querySelector("#task-title").value = task.title || "";
  form.querySelector("#task-desc").value = task.description || "";
  form.querySelector("#due-date").value = task.dueDate || "";
  form.querySelector("#priority").value = task.priority || "medium";
  const modalTitle = DOM.taskModal?.querySelector(".modal-title");
  const saveButton = form.querySelector(".save-task");

  if (modalTitle) modalTitle.textContent = "Edit Task";
  if (saveButton) saveButton.textContent = "Save Changes";
  DOM.taskModal?.showModal();
  form.querySelector("#task-title").focus();
}

function createTaskCard({
  id,
  title,
  description,
  dueDate,
  priority,
  completed,
}) {
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
  taskDescription.className = "task-desc";
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

  if (DOM.taskCount)
    DOM.taskCount.textContent = `You have ${inProgress} task(s) to complete.`;
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
    openTaskModalForNewTask();
  });
}

if (DOM.cancelTask) {
  DOM.cancelTask.addEventListener("click", (event) => {
    event.preventDefault();
    resetTaskModal();
    DOM.taskModal?.close();
  });
}

DOM.taskModal?.addEventListener("close", resetTaskModal);

if (DOM.taskForm && DOM.taskContainer) {
  DOM.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(DOM.taskForm);
    const title = DOM.taskForm.querySelector("#task-title")?.value.trim();

    if (!title) {
      DOM.taskForm.querySelector("#task-title")?.focus();
      return;
    }

    const projectId = taskBeingEdited?.projectId || getActiveProjectId();
    if (!projectId) return;

    const taskDetails = {
      title,
      description: formData.get("task-desc")?.trim() || "",
      dueDate: formData.get("due-date") || "",
      priority: formData.get("priority") || "medium",
    };

    if (taskBeingEdited) {
      updateTask(projectId, taskBeingEdited.id, taskDetails);
    } else {
      addTask(projectId, taskDetails);
    }

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
  const editButton = event.target.closest(".edit-task");
  const removeButton = event.target.closest(".remove-task");
  const taskId = (editButton || removeButton)?.closest(".task-card")?.dataset
    .taskId;
  const projectId = getActiveProjectId();

  if (!taskId || !projectId) return;

  if (editButton) {
    const task = getTasks(projectId).find(({ id }) => id === taskId);
    if (task) openTaskModalForEdit(task, projectId);
    return;
  }

  if (!removeButton) return;

  removeTask(projectId, taskId);
  renderTasks(projectId);
});

document.addEventListener("projectchange", (event) =>
  renderTasks(event.detail.projectId),
);

renderTasks();

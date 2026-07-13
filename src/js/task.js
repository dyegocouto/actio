import { DOM } from "./DOM.js";

function createTaskCard({ title, description, dueDate, priority }) {
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";

  const taskContent = document.createElement("div");
  taskContent.className = "task-content";

  const completion = document.createElement("input");
  completion.type = "checkbox";
  completion.name = "task-completion";

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

    DOM.taskContainer.append(
      createTaskCard({
        title,
        description: formData.get("task-description")?.trim() || "",
        dueDate: formData.get("due-date") || "",
        priority: formData.get("priority") || "medium",
      }),
    );

    DOM.taskForm.reset();
    DOM.taskModal?.close();
  });
}

const elements = {};

function initUI() {
  cacheElements();
  bindEvents();
  loadTasks();
  renderTasks();
}

function cacheElements() {
  elements.addTaskBtn = document.getElementById("addTaskBtn");
  elements.taskModal = document.getElementById("taskModal");
  elements.closeModalBtn = document.getElementById("closeModalBtn");
  elements.cancelBtn = document.getElementById("cancelBtn");
elements.taskForm = document.getElementById("taskForm");
  elements.modalTitle = document.getElementById("modalTitle");
  elements.taskId = document.getElementById("taskId");
  elements.titleInput = document.getElementById("titleInput");
 elements.descriptionInput = document.getElementById("descriptionInput");
  elements.statusInput = document.getElementById("statusInput");
  elements.priorityInput = document.getElementById("priorityInput");
 elements.dueDateInput = document.getElementById("dueDateInput");
  elements.searchInput = document.getElementById("searchInput");
  elements.statusFilter = document.getElementById("statusFilter");
  elements.priorityFilter = document.getElementById("priorityFilter");
  elements.taskList = document.getElementById("taskList");
  elements.emptyState = document.getElementById("emptyState");
  elements.taskCount = document.getElementById("taskCount");
}

function bindEvents() {
  elements.addTaskBtn.addEventListener("click", openAddModal);
  elements.closeModalBtn.addEventListener("click", closeModal);
  elements.cancelBtn.addEventListener("click", closeModal);
  elements.taskForm.addEventListener("submit", handleFormSubmit);
  elements.searchInput.addEventListener("input", renderTasks);
  elements.statusFilter.addEventListener("change", renderTasks);
  elements.priorityFilter.addEventListener("change", renderTasks);

  elements.taskList.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    const taskId = event.target.dataset.id;

    if (action === "edit") {
      openEditModal(taskId);
    }

    if (action === "delete") {
      handleDeleteTask(taskId);
    }
  });
}

function openAddModal() {
  elements.modalTitle.textContent = "Add Task";
  elements.taskForm.reset();
  elements.taskId.value = "";
  elements.statusInput.value = STATUS.TODO;
  elements.priorityInput.value = PRIORITY.MEDIUM;
  elements.dueDateInput.value = getTodayDateString();
  openModal();
}

function openEditModal(id) {
  const task = findTaskById(id);

  if (!task) {
    showMessage("Task not found.");
    return;
  }

  elements.modalTitle.textContent = "Edit Task";
  elements.taskId.value = task.id;
  elements.titleInput.value = task.title;
  elements.descriptionInput.value = task.description;
  elements.statusInput.value = task.status;
  elements.priorityInput.value = task.priority;
  elements.dueDateInput.value = task.dueDate;
  openModal();
}

function openModal() {
  elements.taskModal.classList.add("modal--open");
  elements.taskModal.setAttribute("aria-hidden", "false");
  elements.titleInput.focus();
}

function closeModal() {
  elements.taskModal.classList.remove("modal--open");
  elements.taskModal.setAttribute("aria-hidden", "true");
}

function handleFormSubmit(event) {
  event.preventDefault();

  const taskData = {
    title: elements.titleInput.value,
    description: elements.descriptionInput.value,
    status: elements.statusInput.value,
    priority: elements.priorityInput.value,
    dueDate: elements.dueDateInput.value
  };

  const result = elements.taskId.value
    ? updateTask(elements.taskId.value, taskData)
    : addTask(taskData);

  showMessage(result.message, result.ok ? "success" : "error");

  if (result.ok) {
    closeModal();
    renderTasks();
  }
}

function handleDeleteTask(id) {
  const shouldDelete = window.confirm("Delete this task?");

  if (!shouldDelete) {
    return;
  }

  const result = deleteTask(id);
  showMessage(result.message, result.ok ? "success" : "error");
  renderTasks();
}

function getFilteredTasks() {
  const searchText = elements.searchInput.value.trim().toLowerCase();
  const statusFilter = elements.statusFilter.value;
  const priorityFilter = elements.priorityFilter.value;

  return getTasks().filter((task) => {
    const titleMatches = task.title.toLowerCase().includes(searchText);
    const statusMatches = statusFilter === "All" || getDisplayStatus(task) === statusFilter;
    const priorityMatches = priorityFilter === "All" || task.priority === priorityFilter;

    return titleMatches && statusMatches && priorityMatches;
  });
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();
  elements.taskCount.textContent = `${filteredTasks.length} task${filteredTasks.length === 1 ? "" : "s"}`;
  elements.emptyState.classList.toggle("empty-state--show", filteredTasks.length === 0);

  elements.taskList.innerHTML = filteredTasks.map(createTaskCard).join("");
}

function createTaskCard(task) {
  const displayStatus = getDisplayStatus(task);
  const overdueClass = displayStatus === STATUS.OVERDUE ? " task-card--overdue" : "";

  return `
    <article class="task-card${overdueClass}">
      <div class="task-card__top">
        <h2>${escapeHtml(task.title)}</h2>
        <div class="task-actions">
          <button class="secondary-btn small-btn" type="button" data-action="edit" data-id="${task.id}">Edit</button>
          <button class="danger-btn small-btn" type="button" data-action="delete" data-id="${task.id}">Delete</button>
        </div>
      </div>
      <p>${escapeHtml(task.description) || "No description"}</p>
      <div class="badges">
        <span class="badge status-${displayStatus.toLowerCase().replaceAll(" ", "-")}">${displayStatus}</span>
        <span class="badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
        <span class="due-date">Due: ${task.dueDate}</span>
      </div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", initUI);

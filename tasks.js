const STORAGE_KEY = "nikhil700";

let tasks = [];

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);
  tasks = savedTasks ? JSON.parse(savedTasks) : [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getTasks() {
  return [...tasks].sort((firstTask, secondTask) => {
    const priorityDiff = priorityOrder[firstTask.priority] - priorityOrder[secondTask.priority];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return new Date(firstTask.dueDate) - new Date(secondTask.dueDate);
  });
}

function findTaskById(id) {
  return tasks.find((task) => task.id === Number(id));
}

function validateTaskInput(taskData) {
  if (!taskData.title.trim()) {
    return "Title is required.";
  }

  if (!taskData.dueDate) {
    return "Due date is required.";
  }

  if (!Object.values(STATUS).includes(taskData.status) || taskData.status === STATUS.OVERDUE) {
    return "Please select a valid status.";
  }

  if (!Object.values(PRIORITY).includes(taskData.priority)) {
    return "Please select a valid priority.";
  }

  return "";
}

function validateStatusChange(currentStatus, nextStatus) {
  if (currentStatus === nextStatus) {
    return "";
  }

  if (currentStatus === STATUS.DONE) {
    return "Done tasks cannot be changed back.";
  }

  if (currentStatus === STATUS.TODO && nextStatus === STATUS.DONE) {
    return "Task must move from Todo to In Progress before Done.";
  }

  return "";
}

function addTask(taskData) {
  const validationError = validateTaskInput(taskData);

  if (validationError) {
    return { ok: false, message: validationError };
  }

  tasks.push({
    id: Date.now(),
    title: taskData.title.trim(),
    description: taskData.description.trim(),
    status: taskData.status,
    priority: taskData.priority,
    dueDate: taskData.dueDate,
    createdAt: Date.now()
  });

  saveTasks();
  return { ok: true, message: "Task added." };
}

function updateTask(id, taskData) {
  const existingTask = findTaskById(id);

  if (!existingTask) {
    return { ok: false, message: "Task not found." };
  }

  const validationError = validateTaskInput(taskData);

  if (validationError) {
    return { ok: false, message: validationError };
  }

  const statusError = validateStatusChange(existingTask.status, taskData.status);

  if (statusError) {
    return { ok: false, message: statusError };
  }

  existingTask.title = taskData.title.trim();
  existingTask.description = taskData.description.trim();
  existingTask.status = taskData.status;
  existingTask.priority = taskData.priority;
  existingTask.dueDate = taskData.dueDate;

  saveTasks();
  return { ok: true, message: "Task updated." };
}

function deleteTask(id) {
  const originalLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== Number(id));

  if (tasks.length === originalLength) {
    return { ok: false, message: "Task not found." };
  }

  saveTasks();
  return { ok: true, message: "Task deleted." };
}

const STATUS = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  OVERDUE: "Overdue"
};

const PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
};

const priorityOrder = {
  High: 1,
  Medium: 2,
  Low: 3
};

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function isOverdue(task) {
  return Boolean(task.dueDate && task.dueDate < getTodayDateString() && task.status !== STATUS.DONE);
}

function getDisplayStatus(task) {
  return isOverdue(task) ? STATUS.OVERDUE : task.status;
}

function showMessage(message, type = "error") {
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = message;
  messageBox.className = `message message--${type} message--show`;

  window.clearTimeout(showMessage.timerId);
  showMessage.timerId = window.setTimeout(() => {
    messageBox.className = "message";
    messageBox.textContent = "";
  }, 3000);
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value || "";
  return div.innerHTML;
}

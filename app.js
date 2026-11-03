// tasks 陣列用來存放所有待辦事項，每筆資料都是一個物件。
let tasks = [];
let nextId = 1;

// 先取得網頁元素，之後才能透過 JavaScript 更新畫面。
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const remainingCount = document.getElementById("remainingCount");
const emptyMessage = document.getElementById("emptyMessage");
const clearButton = document.getElementById("clearButton");
const notice = document.getElementById("notice");

// 將操作結果或錯誤原因顯示在畫面上。
function showNotice(message) {
  notice.textContent = message;
}

// 依照 tasks 陣列重新建立清單，確保資料和畫面一致。
function renderTasks() {
  taskList.innerHTML = "";

  // forEach 逐筆讀取資料，建立每一個待辦事項的畫面。
  tasks.forEach(function(task) {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.dataset.id = task.id;
    checkbox.className = "task-checkbox";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.title;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "刪除";
    deleteButton.className = "delete-button";
    deleteButton.dataset.id = task.id;

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });

  // filter 找出未完成的資料，再用 length 得到數量。
  const unfinishedTasks = tasks.filter(function(task) {
    return task.completed === false;
  });
  remainingCount.textContent = unfinishedTasks.length;

  // 沒有資料時顯示空清單訊息。
  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}

// 檢查輸入內容，建立新資料並更新畫面。
function addTask() {
  const title = taskInput.value.trim();

  // trim 去除前後空白，避免只輸入空格。
  if (title === "") {
    showNotice("請先輸入待辦事項！");
    taskInput.focus();
    return;
  }

  // 不允許相同名稱重複加入，忽略英文大小寫差異。
  const isDuplicate = tasks.some(function(task) {
    return task.title.toLowerCase() === title.toLowerCase();
  });
  if (isDuplicate) {
    showNotice("這項待辦事項已經存在！");
    taskInput.focus();
    return;
  }

  const newTask = { id: nextId, title: title, completed: false };
  tasks.push(newTask);
  nextId = nextId + 1;
  taskInput.value = "";
  showNotice("新增成功！");
  renderTasks();
  taskInput.focus();
}

// 找到指定編號的資料，切換它的完成狀態。
function toggleTask(id) {
  const task = tasks.find(function(item) {
    return item.id === id;
  });

  if (task !== undefined) {
    task.completed = !task.completed;
    showNotice(task.completed ? "已標記為完成！" : "已改回未完成！");
    renderTasks();
  }
}

// 找出指定資料的位置，確認後才刪除。
function deleteTask(id) {
  const taskIndex = tasks.findIndex(function(item) {
    return item.id === id;
  });

  if (taskIndex === -1) {
    showNotice("找不到這筆資料。");
    return;
  }

  if (confirm("確定要刪除「" + tasks[taskIndex].title + "」嗎？")) {
    // splice 從找到的位置刪除一筆資料。
    tasks.splice(taskIndex, 1);
    showNotice("刪除成功！");
    renderTasks();
  }
}

// 點擊新增按鈕時執行 addTask。
addButton.addEventListener("click", addTask);

// 在輸入框按 Enter，也可以新增待辦事項。
taskInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// 事件委派：在清單外層監聽刪除按鈕，不必替每筆資料個別綁定。
taskList.addEventListener("click", function(event) {
  const target = event.target;
  const id = Number(target.dataset.id);
  if (target.classList.contains("delete-button")) {
    deleteTask(id);
  }
});

// 勾選框狀態改變時，更新對應資料。
taskList.addEventListener("change", function(event) {
  if (event.target.classList.contains("task-checkbox")) {
    toggleTask(Number(event.target.dataset.id));
  }
});

// 清空前先確認，避免使用者不小心刪掉全部資料。
clearButton.addEventListener("click", function() {
  if (tasks.length === 0) {
    showNotice("目前沒有資料可以清空。");
    return;
  }
  if (confirm("確定要清空全部待辦事項嗎？此操作無法復原。")) {
    tasks = [];
    showNotice("已清空全部待辦事項。");
    renderTasks();
  }
});

// 網頁載入後先顯示一次清單狀態。
renderTasks();

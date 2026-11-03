# 專題報告

## 1. 名稱

- 專題名稱：我的待辦清單
- 學號：24125114
- GitHub連結：https://github.com/Kisaragi318/odo-list

---

## 2. 目的

平常有許多事情需要處理，如果只靠記憶，容易忘記還有哪些事情沒有完成。因此我製作這個待辦清單，讓使用者可以記錄要做的事情、標記完成狀態及刪除不需要的項目，方便整理每天的工作。

---

## 3. 功能

- 使用者在輸入框輸入事項並按下「新增」按鈕，系統就會將事項加入待辦清單。
- 使用者在輸入框按下 Enter 鍵，也可以快速新增待辦事項。
- 使用者勾選事項前面的核取方塊，該事項就會標記為已完成並顯示刪除線。
- 使用者取消勾選核取方塊，該事項就會恢復成未完成狀態。
- 使用者按下單筆事項旁邊的「刪除」按鈕，確認後就會刪除該事項。
- 使用者新增、完成或刪除事項後，畫面會立即更新尚未完成的數量。
- 使用者按下「清空全部」按鈕並確認後，系統就會刪除所有待辦事項。
- 當清單沒有任何資料時，畫面會顯示「目前沒有待辦事項」。
- 使用者輸入空白內容或重複事項時，系統會顯示提示，不會新增資料。

---

## 4. 程式運作流程說明

### 步驟 1：準備待辦事項資料與網頁元素（程式初始化）

說明：

網頁載入時，程式先建立一個空的 `tasks` 陣列，用來存放所有待辦事項。接著取得 HTML 裡的輸入框、按鈕、清單和提示文字，讓後續程式可以操作這些畫面元素。

```js
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
```

程式碼說明：

- `tasks` 是陣列，負責儲存待辦事項。
- `nextId` 是下一筆資料要使用的編號，讓每筆事項都有不同的 ID。
- `document.getElementById()` 可以依照 HTML 元素的 id 找到對應的網頁元素。
- `const` 用來宣告不需要重新指定的元素變數。

### 步驟 2：顯示操作提示（`showNotice()`）

說明：

當使用者新增、刪除資料，或輸入錯誤時，程式會呼叫 `showNotice()`，將訊息顯示在網頁下方，讓使用者知道操作結果。

```js
// 將操作結果或錯誤原因顯示在畫面上。
function showNotice(message) {
  notice.textContent = message;
}
```

程式碼說明：

- `showNotice(message)` 接收一段文字作為參數。
- `textContent` 可以修改 HTML 元素內顯示的文字。
- 例如新增成功時，會顯示「新增成功！」。

### 步驟 3：依照陣列重新顯示清單（`renderTasks()`）

說明：

每次資料新增、修改或刪除後，程式都會呼叫 `renderTasks()`。這個函式會先清除舊的清單，再讀取 `tasks` 陣列並重新建立每一筆待辦事項，同時更新未完成數量和空清單提示。

```js
function renderTasks() {
  taskList.innerHTML = "";

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

  const unfinishedTasks = tasks.filter(function(task) {
    return task.completed === false;
  });

  remainingCount.textContent = unfinishedTasks.length;

  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}
```

程式碼說明：

- `innerHTML = ""` 會先清空原本的清單內容，避免重複顯示。
- `forEach()` 會逐筆讀取 `tasks` 陣列中的物件。
- `createElement()` 建立清單、核取方塊、文字和刪除按鈕。
- `appendChild()` 將建立好的元素放進清單。
- `filter()` 篩選出 `completed` 為 `false` 的資料，再用 `length` 算出未完成數量。
- `if...else` 判斷陣列是否為空，決定要不要顯示空清單提示。

### 步驟 4：新增待辦事項（`addTask()`）

說明：

使用者輸入事項後，按下「新增」或鍵盤上的 Enter，程式會執行 `addTask()`。函式會先檢查輸入是否為空白，以及是否已經有相同名稱的事項；通過檢查後，才建立新物件並加入陣列。

```js
function addTask() {
  const title = taskInput.value.trim();

  if (title === "") {
    showNotice("請先輸入待辦事項！");
    taskInput.focus();
    return;
  }

  const isDuplicate = tasks.some(function(task) {
    return task.title.toLowerCase() === title.toLowerCase();
  });

  if (isDuplicate) {
    showNotice("這項待辦事項已經存在！");
    taskInput.focus();
    return;
  }

  const newTask = {
    id: nextId,
    title: title,
    completed: false
  };

  tasks.push(newTask);
  nextId = nextId + 1;
  taskInput.value = "";
  showNotice("新增成功！");
  renderTasks();
  taskInput.focus();
}
```

程式碼說明：

- `value` 取得輸入框裡的文字，`trim()` 去除文字前後的空白。
- 如果輸入內容是空字串，就顯示提示並用 `return` 結束函式。
- `some()` 檢查陣列中是否有相同名稱的事項。
- `toLowerCase()` 讓英文大小寫不同也會視為相同。
- 新增的資料是一個物件，包含 `id`、`title` 和 `completed` 三個屬性。
- `push()` 將新物件加入 `tasks` 陣列。
- 新增成功後清空輸入框，再呼叫 `renderTasks()` 更新畫面。

### 步驟 5：切換事項完成狀態（`toggleTask()`）

說明：

使用者勾選或取消勾選事項前面的核取方塊時，程式會執行 `toggleTask()`。函式會利用事項編號找到對應的物件，再將完成狀態切換，最後重新顯示清單。

```js
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
```

程式碼說明：

- `find()` 會從陣列中找出符合編號的第一筆資料。
- `if` 確認有找到資料後才修改，避免找不到資料時發生錯誤。
- `!task.completed` 會把原本的布林值反轉，`true` 變成 `false`，`false` 變成 `true`。
- 修改完成狀態後，呼叫 `renderTasks()` 讓核取方塊、文字樣式和未完成數量一起更新。

### 步驟 6：刪除單筆待辦事項（`deleteTask()`）

說明：

使用者按下某筆事項旁邊的「刪除」按鈕時，程式會執行 `deleteTask()`。程式先找出該事項在陣列中的位置，再跳出確認視窗；只有使用者確認後才會刪除資料。

```js
function deleteTask(id) {
  const taskIndex = tasks.findIndex(function(item) {
    return item.id === id;
  });

  if (taskIndex === -1) {
    showNotice("找不到這筆資料。");
    return;
  }

  if (confirm("確定要刪除「" + tasks[taskIndex].title + "」嗎？")) {
    tasks.splice(taskIndex, 1);
    showNotice("刪除成功！");
    renderTasks();
  }
}
```

程式碼說明：

- `findIndex()` 會回傳符合編號的資料位置；如果找不到，就會回傳 `-1`。
- 找不到資料時顯示提示，並用 `return` 結束函式。
- `confirm()` 會跳出確認視窗，使用者按下確定才會執行刪除。
- `splice(taskIndex, 1)` 從指定位置刪除一筆資料。
- 刪除完成後呼叫 `renderTasks()`，讓畫面立即更新。

### 步驟 7：設定按鈕與鍵盤事件（`addEventListener()`）

說明：

網頁載入後，程式使用 `addEventListener()` 監聽使用者的操作。按下新增按鈕或在輸入框按 Enter 時會新增資料；清單內的刪除按鈕和核取方塊也會觸發對應的功能。

```js
addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

taskList.addEventListener("click", function(event) {
  const target = event.target;
  const id = Number(target.dataset.id);

  if (target.classList.contains("delete-button")) {
    deleteTask(id);
  }
});

taskList.addEventListener("change", function(event) {
  if (event.target.classList.contains("task-checkbox")) {
    toggleTask(Number(event.target.dataset.id));
  }
});
```

程式碼說明：

- `addEventListener("click", ...)` 監聽新增按鈕的點擊事件。
- `keydown` 監聽鍵盤按鍵，透過 `event.key` 判斷使用者是否按下 Enter。
- 清單外層監聽 `click` 和 `change`，這種方式稱為事件委派。
- `event.target` 可以取得實際被操作的元素。
- `dataset.id` 讀取元素上設定的資料編號，`Number()` 將編號轉成數字。
- `classList.contains()` 用來判斷被操作的元素是不是刪除按鈕或核取方塊。

### 步驟 8：清空全部待辦事項（清空按鈕事件）

說明：

使用者按下「清空全部」時，程式會先檢查目前是否有資料。如果清單不是空的，就跳出確認視窗；使用者確認後才會將陣列清空並更新畫面。

```js
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
```

程式碼說明：

- `tasks.length === 0` 用來判斷陣列是否沒有資料。
- 如果沒有資料，就顯示提示並結束，不需要再跳出確認視窗。
- `confirm()` 讓使用者確認是否真的要清空。
- `tasks = []` 將陣列重新設定為空陣列。
- 最後呼叫 `renderTasks()`，畫面就會顯示空清單提示，未完成數量也會變成 0。

### 步驟 9：網頁載入時顯示初始畫面（`renderTasks()`）

說明：

所有事件設定完成後，程式在最後呼叫一次 `renderTasks()`。這樣使用者第一次打開網頁時，就能看到正確的初始清單狀態。

```js
renderTasks();
```

程式碼說明：

- 呼叫 `renderTasks()` 會根據目前的 `tasks` 陣列建立清單。
- 因為一開始 `tasks` 是空陣列，所以第一次開啟網頁時會顯示「目前沒有待辦事項」，未完成數量則是 0。
- 後續每次資料變動，也會再次呼叫相同函式更新畫面。
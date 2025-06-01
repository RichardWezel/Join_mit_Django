
/**
 * Contains the Index of the current dragged task in tasks[] global array.
 * This variable is used to identify which task is currently being dragged in the Kanban board.  
 * 
 * @type {number} - Index of the current dragged task in tasks[] global array
 */
let currentDraggedElement;

/**
 * This variable is used to control the dialog state in the Kanban board.
 * It can have three different values:
 * - 'inactive': The dialog is not open.
 * - 'taskdetails': The dialog is open and displays the task details.
 * - 'edit': The dialog is open and allows the user to edit the task content.
 * 
 * @type {String} - The current status of the dialog in the Kanban board.
 */
let dialog_status = 'inactive';

/**
 * This function initializes the Kanban board by performing several asynchronous operations:
 * 1. It retrieves the current user ID from the server.
 * 2. It includes the HTML content of the board.
 * 3. It sets the user's initials in the header.
 * 4. It fetches the tasks from the server and stores them in the `tasks` array.
 * 5. It saves the current user ID on the server.
 */
async function init_board() {
    await getCurrentUserIdFromSessionStorage();
    await includeHTML();
    await setUserInitialsAtHeader(); // @include.js:39
    await getTasksOfServer(); // @storage.js:56
    saveCurrentUserIdInSessionStorage(currentUserId);
    await renderColumnContent(); // @board_main_renderTasks.js:7
    await toastMessageNewTask(); 
}

/**
 * Marks the adding of the new task.
 */
async function toastMessageNewTask() {
    await getNewTask_statusFromServer();
    if (newTask_status === true) {
        await openToastMessageAddTask();
        await timeout (1300);
        await closeToast();
        newTask_status = 'false';
        await saveNewTask_statusOnServer();
    }
}
  
/**
 * Hides the toast message box
 */
function closeToast() {
  let container = document.getElementById('toastMessageAddTask'); //@board.html:43
  container.classList.add('d-none');
}

/**
 * Gets Value of search-input-field (in the upper area of the page) in lowerCase letters and trasfer it to renderColumnContent()
 */
function searchTask() {
    let search_content = document.getElementById('task_to_be_found').value;
    search_content = search_content.toLowerCase();
    renderColumnContent(search_content);
}

/**
 * Changes the Due Date format from dd/mm/yy to dd/mm/yyyy
 * 
 * @param {Number} taskId - Index of task in tasks array 
 * @returns {String} - String with the format dd/mm/yyyy
 */
function changedue_dateFormatInLongYear(taskId) {
    let date = tasks[taskId].due_date;
    date = date.split('/');
    let year = parseInt(date[2]); 
    year = year + 2000;
    let newDate = date[0] + '/' + date[1] + '/' + year;
    return newDate
}

/**
 * Closes the dialog window depending on the dialog status.
 * If the task details are displayed, the dialog window is closed and the Kanban board is displayed.
 * If the dialog to edeting task details is active, the task details are displayed.
 * If the dialog to add a new task is active, the dialog window is closed and the Kanban board is displayed.
 * 
 * @param {Number} taskId - Index of current called task in tasks[] global array
 */
async function closeDialog(taskId) {
    
    if (typeof taskId !== 'undefined' ) {
        // dialog window with task details is open:
        if(dialog_status == 'taskdetails') {
            let container = document.getElementById('dialog_container');
            container.classList.add('d-none');
            await renderColumnContent(); // @ board_main.js:51
            dialog_status = 'inactive';
        } 
        // dialog window to change task content is open:
        else if (dialog_status == 'edit') {
            await renderDialogTask(taskId); 
            dialog_status = 'taskdetails';
        } 
        // dialog window to add new task is open:
        else if (dialog_status == 'addTask') {
            let container = document.getElementById('dialog_container');
            container.classList.add('d-none');
            await init_board(); // @ board_main.js:51
            dialog_status = 'inactive';
        }
    } else  if (dialog_status == 'taskdetails') {
        let container = document.getElementById('dialog_container');
        container.classList.add('d-none');
        await renderColumnContent(); // @ board_main.js:51
        dialog_status = 'inactive';
    } else if (dialog_status == 'addTask') {
        let container = document.getElementById('dialog_container');
        container.classList.add('d-none');
        await init_board(); // @ board_main.js:51
        dialog_status = 'inactive';
    }
} 

/**
 * Link to the add task html site.
 */
async function redirectToTaskPage(status) {
    statusBymobile_addTask_board = status;
    await setStatusToServer();
    await getStatusFromServer();
    window.location.href = "addTask.html";
}

/**
 * If the max-width of 1000px was reached, the addTask button links to addTask.html site and does not allow the dialog for addTAsk to appear.
 */
window.onload = function() {
    let mediaQuery = window.matchMedia("(max-width: 1000px)");
    if (mediaQuery.matches) {
        let dialogContainer = document.getElementById("dialog_container");
        dialogContainer.style.display = "none"; 
    } else {
        let addTaskButton = document.querySelector(".add_task_btn_mobile");
        addTaskButton.addEventListener("click", redirectToTaskPage); 
    }
};
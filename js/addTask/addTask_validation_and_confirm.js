/**
 * Main json structure of new task.
 */
let newTask = {
  "title": "",
  "description": "",
  "category": "",
  "contacts": [],
  "due_date": "",
  "priority": "",
  "subtasks": [],
  "status": "",
};

// Main json structure of new task with example values
// {
//   "title": "Meeting vorbereiten",
//   "description": "Vorbereitung für das große Meeting",
//   "category": "Work",
//   "due_date": "03/06/25",    // beachte das Datumsformat: TT/MM/JJ
//   "priority": "high",
//   "status": "open",
//   "contacts": [
//     1, 2, 5       // IDs der Kontakte, KEINE komplexen Objekte, nur IDs!
//   ],
//   "subtasks": [
//     {
//       "title": "Folien erstellen",
//       "description": "PowerPoint vorbereiten",
//       "is_done": false
//     },
//     {
//       "title": "Raum buchen",
//       "description": "Meetingraum reservieren",
//       "is_done": true
//     }
//   ]
// }

/**
 * Initializes creating a new task.
 */
async function initNewTask() {
  if (
    validation('titleAddtask', 'validation_text_title') == true &&
    validation('AddTaskDate', 'validation_text_due_date') == true &&
    validation('categoryDropDownBtn', 'validation_text_category') == true) {
    await createNewTaskInit();
  }
  else {
    console.error("Validation failed. Please check your inputs.");
  }
}


/**
 * Validates the input fields of the transmitted ids to see whether an input is present. 
 * If there is no input, a red border is added, an error text appears and it returns false.
 * If an input is present, the red border, the error text are removed amd it returns true. 
 * 
 * @param {String} inputId - id of input element which is to validate
 * @param {String} errortextId - id of error text element witch appears in case of non valide
 * @returns {Boolean} - Marks whether the all is valide or not.
 */
function validation(inputId, errortextId) {
  let input = document.getElementById(inputId);
  let errortext = document.getElementById(errortextId);
  if (!input || !errortext) {
    console.error("Input oder Errortext nicht gefunden.");
    return false;
  }
  if (input.value === '' ) {
    invalidateInput(inputId, errortextId);
    return false;
  } else {
    return validateInput(inputId, errortextId)
  }
}

function invalidateInput(inputId, errortextId) {
  let input = document.getElementById(inputId);
  let errortext = document.getElementById(errortextId);
  input.classList.add('red-border');
  errortext.style.visibility = "visible";
  window.location.hash = inputId;
  return false;
}

function validateInput(inputId, errortextId) {
  let input = document.getElementById(inputId);
  let errortext = document.getElementById(errortextId);
  input.classList.remove('red-border');
  errortext.style.visibility = "hidden";
  return true;
}

  
/**
 * Initials the functions to save the new task.
 * Sets the newTask status on true to start the toast message on borad html.
 * Changes to board.html
 */
async function createNewTaskInit() {
  await saveNewTask();
  await deleteNewTaskContent();
  await removeAllInputes();
  newTask_status = 'true';
  await saveNewTask_statusOnServer();
  changeWindow();
}

/**
 * Initials the functions to saves the new task.
 */
async function saveNewTask() {
  await getAllSettingsOfNewTask();
  await createNewTask(newTask);
  await getTasksFromServer();
}

/**
 * Change to bord.html
 */
function changeWindow() {
  window.location.href = "board.html";
}

/**
 * Calls all functions which getting the values of the new task.
 */
async function getAllSettingsOfNewTask() {
  await getTextInputValues();
  await due_date_newTask_addTask();
  await getCategory();
  await getContacts();
  await getPrio();
  await getSubtask();
  await getStatus();
}

/**
 * Saves the input values in variables.
 */
function getTextInputValues() {
  let title = document.getElementById('titleAddtask').value;
  let description = document.getElementById('description').value;
  newTask.title = title;
  newTask.description = description;
}

/**
 * Adds the due date from Input to newTask.due_date with the right format dd/mm/yy.
 */
function  due_date_newTask_addTask() {
  let due_dateInput = document.getElementById('AddTaskDate').value;
  due_dateInput = due_dateInput.split('-');
  let year = parseInt(due_dateInput[0]); 
  year = year - 2000;
  let newDate = due_dateInput[2] + '/' + due_dateInput[1] + '/' + year;
  newTask.due_date = newDate;
}

/**
 * Saves the choosen category to the new array.
 */
function getCategory() {
  newTask.category = pushCategory;
}

// {
//   "title": "Meeting vorbereiten",
//   "description": "Vorbereitung für das große Meeting",
//   "category": "Work",
//   "due_date": "03/06/25",    // beachte das Datumsformat: TT/MM/JJ
//   "priority": "high",
//   "status": "open",
//   "contacts": [
//     1, 2, 5       // IDs der Kontakte, KEINE komplexen Objekte, nur IDs!
//   ],
//   "subtasks": [
//     {
//       "title": "Folien erstellen",
//       "description": "PowerPoint vorbereiten",
//       "is_done": false
//     },
//     {
//       "title": "Raum buchen",
//       "description": "Meetingraum reservieren",
//       "is_done": true
//     }
//   ]
// }


/**
 * Saves the choosen contacts to the new task.
 */
function getContacts() {
  let selected_contacts = [];
  for (let i = 0; i < contacts_addTask.length; i++) {
    let contact = contacts_addTask[i];
    if (contact.select_status == true) {
      delete contact.select_status;
      selected_contacts.push(contact.id);
    }
  }
  newTask.contacts = selected_contacts;
}

/**
 * Saves the choosen priority to the new task.
 */
function getPrio() {
  newTask.priority = prio;
}

/**
 * Saves the subtasks to the new task.
 */
function getSubtask() {
  newTask.subtasks = subtasklists;
}

/**
 * Saves the status of the new task.
 */
async function getStatus() {
  newTask.status = statusBymobile_addTask_board;
}

/**
 * Resets the newTask array.
 */
async function deleteNewTaskContent() {
  newTask = {
    "title": "",
    "description": "",
    "category": "",
    "contacts": [],
    "due_date": "",
    "priority": "",
    "subtasks": [],
    "status": ""
  }
  saveStatusToSessionStorage("toDo");
}

/**
 * clear the content of the new task page.
 */
function removeAllInputes() {
  // Remove the Add Task inputs
  prio = '';
  pushCategory = [];
  subtasklists = [];
  rendersubtasklist();
  document.getElementById('titleAddtask').value = '';
  document.getElementById('AddTaskDate').value = '';
  document.getElementById('description').value = '';
  document.getElementById('categoryDropDownBtn_text').innerHTML = 'Select task category';
  closeCategoryDropdown();
  changePriority("Medium");
  deleteSelectedContacts()
}

/**
 * Deletes the selected Contacts.
 */
function deleteSelectedContacts() {
  for (let i = 0; i < contacts_addTask.length; i++) {
    if (contacts_addTask[i].select_status == true) {
      contacts_addTask[i].select_status = false;
      document.getElementById(`contact${i}`).classList.remove('selected');
      document.getElementById(`selected_img${i}`).innerHTML = checkboxHTML_unchecked();
    }
  }
  renderSelectedContactsRow();
}

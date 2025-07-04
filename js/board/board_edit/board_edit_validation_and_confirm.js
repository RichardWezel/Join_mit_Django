
/**
 * Starts the functions that save and display the changed entries.
 * 
 * @param {Number} taskId - Index of task in tasks array
 */
async function confirmInputsOfEditDialog(taskId) {
    getInputValuesOfEditDialog(); 
    updateTaskOnServer(currentTaskContent);
    await getTasksOfServer();
    dialog_status = 'taskdetails';
    await deleteCurrentTaskContent();
    renderDialogTask(taskId);    
}

/**
 * Validates the inputfields "due date" and "title" whether there is content and returns true or false.
 * 
 * @returns {Boolean} false by empty input field / true by content
 */
function input_value_validation(){
    let input_value_due_date = document.getElementById('edit_input_due_date').value;
    let input_value_title = document.getElementById('title_edit').value;
    if (input_value_due_date == '' || input_value_title == '') {
        return false;
    } else {
        true;
    }
}

/**
 * Load content of title, description, due date inputs and priority choice in currentTaskContent.
 * Contacts of Assigned to section and subtasks section are always directly saved in currentTaskContent after changes.
 */
function getInputValuesOfEditDialog() {
    currentTaskContent.title = document.getElementById('title_edit').value;
    currentTaskContent.description = document.getElementById('edit_input_description').value;
    currentTaskContent.due_date = changedue_dateFormatInShortYear();
    currentTaskContent.priority = prioStatusEdit;
}

/**
 * Chages the due date fomat from yyyy-mm-dd to dd/mm/yy
 * 
 * @returns {String} "dd/mm/yy"
 */
function changedue_dateFormatInShortYear() {
    let date = document.getElementById('edit_input_due_date').value;
    date = date.split('-');
    let year = parseInt(date[0]); 
    year = year - 2000;
    let newDate = date[2] + '/' + date[1] + '/' + year;
    return newDate
}

/**
 * Loads the items of the new task to tasks
 * 
 * @param {Number} taskId - - Index of task in tasks array
 */
function loadChangedContentInTasksArray(taskIndex) {
    tasks[taskIndex] = currentTaskContent;
}

/**
 * Resets the currentTaskContent array.
 */
function deleteCurrentTaskContent() {
    currentTaskContent = '';
}

/**
 * Validates the input value. Controlls whether there is no content and add in red border and error text in case of true.
 */
function checkFormValidation_title() {
    let titleInput = document.getElementById('title_edit');
    let errormessage_title = document.getElementById('errormessage_title');
    if (titleInput.value === '' || titleInput.value == null) {
        titleInput.classList.add('non_valide'); // red border
        errormessage_title.innerHTML = 'This field is required'; // div is under the Input
        document.getElementById('errormessage_title').style.display = 'block'; // let div with text appear
        document.getElementById('close_section_edit').scrollIntoView({ behavior: 'smooth', block: 'start' }); // scroll to input
        document.getElementById('title_edit').focus();
  } else {
    titleInput.classList.remove('non_valide');
    errormessage_title.style.display = 'none';
  }
}

/**
 * Validates the due date input. Corlor the border and show a error message in case of there is no contaent at input.
 */
function checkFormValidation_due_date() {
    let due_dateInput = document.getElementById('edit_input_due_date');
    let errormessage_due_date = document.getElementById('errormessage_due_date');
    if (due_dateInput.value == '') {
        due_dateInput.classList.add('non_valide'); // red border
        errormessage_due_date.innerHTML = 'This field is required'; // div is under the Input
        document.getElementById('errormessage_due_date').style.display = 'block'; // let div with text appear
        document.getElementById('close_section_edit').scrollIntoView({ behavior: 'smooth', block: 'start' }); // scroll to input
        document.getElementById('edit_input_due_date').focus();
  } else {
    due_dateInput.classList.remove('non_valide');
    errormessage_due_date.style.display = 'none';
  }
}
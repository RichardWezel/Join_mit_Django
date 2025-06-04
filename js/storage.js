const STORAGE_TOKEN = "OV30V75C6XC2NMC469UVAT7NWW775KEIDF6SU6PL";
const STORAGE_URL = `https://remote-storage.developerakademie.org/item`;


let tasks = [];
let contacts_global = [];
let currentUser = [];
let users = [];
let newTask_status = false;
let newUser;

// ***** user ***** //

async function getUsersOfServer() {
  const url = `http://127.0.0.1:8000/api/users/`;
  const res = await fetch(url);
  const data = await res.json();
  console.log('Received Users from backend:', data); 
  users = data;
  return data;
}

// async function getUsersFromServer() {

//   try {
//     let ServerData;
//     ServerData = await getItem("users");
//     let newData = JSON.parse(ServerData.data.value);
//     users = newData;
//   } catch (e) {
//     console.warn("Could not load users!");
//   }
// }

async function saveUserOnServer(userId, userData) {
  const url = `http://127.0.0.1:8000/api/users/${userId}/`;
  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData),
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Error while saving the user: ${res.status}`);
    }
    return res.json();
  });
}

async function getUserById(userId) {
  const url = `http://127.0.0.1:8000/api/users/${userId}/`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

/**
 * Add the new user to contact list of contacts.html.
 * 
 * @param {String} firstName 
 * @param {String} secondName 
 * @param {String} mail 
 * @param {String} password 
 */
function creatNewUser(firstName, secondName, mail, password) {
  if (typeof firstName !== "string" || typeof secondName !== "string" || typeof mail !== "string" || typeof password !== "string") {
    console.error("Invalid input data:", { firstName, secondName, mail, password });
    return;
  }
  newUser = {
    first_name: firstName,
    second_name: secondName,
    color: "#ff4646",
    mail: mail,
    password: password,
    lockedIn: false,
  };
}

async function createNewUser(userData) {
  const url = "http://127.0.0.1:8000/api/users/";  
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData),
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Error while creating the user: ${res.status} ${res.statusText}`);
    }
    return res.json();  
  });
}

async function deleteUser(userId) {
  const url = `http://127.0.0.1:8000/api/users/${userId}/`;
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Error while deleting the user: ${res.status}`);
    }
    return res.json();
  }
  ).catch(err => {
    console.error('Error deleting user:', err);
  }
  );
}

async function updateLockedIn(userId, newStatus) {
  let index = findUserIndexById(userId);
  if (index !== null) {
    users[index].locked_in = newStatus;
    await saveUserOnServer(userId, { locked_in: newStatus }); // nur das Feld, wenn du nicht alles schicken willst
    console.log(`locked_in für User mit ID ${userId} wurde auf ${newStatus} gesetzt.`);
  } else {
    console.warn(`User mit ID ${userId} nicht gefunden.`);
  }
}


// ***** current_user ***** //

/**
 * Loads the currentUserId from sessionStorage.
 * 
 * @returns {Integer|null} currentUserId
 */
function getCurrentUserIdFromSessionStorage() {
  const storedId = sessionStorage.getItem('currentUserId');
  
  if (storedId !== null) {
    const currentUserId = parseInt(storedId, 10);
    return currentUserId;
  } else {
    return null;
  }
}


/**
 * Saves the currentUserId to sessionStorage.
 * 
 * @param {Integer} currentUserId 
 */
function saveCurrentUserIdInSessionStorage(currentUserId) {
  if (typeof currentUserId !== "number") {
    console.error("Invalid currentUserId:", currentUserId);
    return;
  }
  sessionStorage.setItem('currentUserId', currentUserId.toString());
}


// ***** tasks ***** //

async function getTasksOfServer() {
  const url = `http://127.0.0.1:8000/api/tasks/`;
  const res = await fetch(url);
  const data = await res.json();
  tasks = data;
  return data;
}

function updateTaskOnServer(taskContent) {
  if (!taskContent || typeof taskContent !== "object") {
    console.error("Invalid taskContent:", taskContent);
    return;
  }

  const taskId = taskContent.id;
  if (typeof taskId !== "number" || taskId < 0) {
    console.error("Invalid taskId in taskContent:", taskId);
    return;
  }

  const url = `http://127.0.0.1:8000/api/tasks/${taskId}/`; // Korrigiert hier!

  fetch(url, {
    method: "PATCH", // oder PATCH wenn du nur Teilupdates machst
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskContent),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json(); // Antwort parsen
    })
    .then((data) => {
      console.log("Task erfolgreich aktualisiert:", data);
    })
    .catch((error) => {
      console.error("Fehler beim Updaten der Task:", error);
    });
}





function prepareTaskDataForSave(task) {
  const { id, ...taskDataWithoutId } = task;

  const contacts = task.contacts.map(contact => contact.id);

  const dueDateParts = task.due_date.split('/');
  let dueDateISO = `20${dueDateParts[2]}-${dueDateParts[1]}-${dueDateParts[0]}`;

  return {
    ...taskDataWithoutId,
    due_date: dueDateISO,
    contacts: contacts,
    // Hier wichtig: Subtasks mit id beibehalten
    subtasks: task.subtasks.map(subtask => ({
      id: subtask.id,  // ID darf mit
      name: subtask.name,
      done: subtask.done,
    }))
  };
}

async function deleteTaskAndUpdateTasks(taskId) {
  await deleteTask(taskId);
  await getTasksOfServer();
  await closeDialog();
  await getTasksOfServer(); 
  await renderColumnContent(); 

}
  


async function deleteTask(taskId) {
  const url = `http://127.0.0.1:8000/api/tasks/${taskId}/`;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(`Error while deleting the task: ${res.status}`);
    }

    return true;

  } catch (err) {
    console.error('Error deleting task:', err);
    return false;
  }
}


async function createNewTask(taskData) {
  const url = `http://127.0.0.1:8000/api/tasks/`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskData),
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Error while creating the task: ${res.status}`);
    }
    return res.json();
  });
}

/**
 * Sorts the Contacts of the task from a-z.
 */
function sortTasksContacts() {
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].contacts.sort((a, b) => {
      let firstNameA = a.first_name.toLowerCase();
      let firstNameB = b.first_name.toLowerCase();
      
      if (firstNameA < firstNameB) {
        return -1;
      }
      if (firstNameA > firstNameB) {
        return 1;
      }
      return 0;
    });
  }
}

// ***** contacts ***** //

/**
 * Loads the contacts from Server and save this in contacts_global @storage.js.
 * 
 * @returns {JSON} - contacts
 */
async function getContactsFromServer() {
  const url = `http://127.0.0.1:8000/api/contacts/`;
  const res = await fetch(url);
  const data = await res.json();
  contacts_global = data;
  return data;
}

/**
 * Saves the contact data to server.
 * 
 * @param {Integer} contactId 
 * @param {JSON} contactData 
 * @returns res.json()
 */
async function saveContactOnServer(contactId, contactData) {
  const url = `http://127.0.0.1:8000/api/contacts/${contactId}/`;
  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(contactData),
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Error while saving the contact: ${res.status}`);
    }
    return res.json();
  });
}

/**
 * Sorts the Contacts from a-z.
 */
function sortContacts() {
  contacts_global.sort((a, b) => {
    const firstNameA = a.first_name.toLowerCase();
    const firstNameB = b.first_name.toLowerCase();
  
    if (firstNameA < firstNameB) {
      return -1;
    }
    if (firstNameA > firstNameB) {
      return 1;
    }
    return 0;
  });
}


// ***** accounts ***** //


/**
 * Main task storage for the program.
 * 
 * @type {JSON}
 */
let accounts = [];

/**
 * Load the tasks JSON Array from Server in tasks[]
 */
async function getAccountsFromServer() {
  try {
    let newData = getUsersOfServer()
    accounts = newData;
  } catch (e) {
    console.warn("Could not load accounts!");
  }
}


// Standardwert setzen, wenn Session noch leer ist
statusBymobile_addTask_board = loadStatusFromSessionStorage() || "toDo";

/**
 * Save status to Session Storage
 */
function saveStatusToSessionStorage(status) {
  sessionStorage.setItem("newTaskStatus", status);
}

/**
 * Load status from Session Storage
 */
function loadStatusFromSessionStorage() {
  return sessionStorage.getItem("newTaskStatus");
}
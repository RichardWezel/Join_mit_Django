const STORAGE_TOKEN = "OV30V75C6XC2NMC469UVAT7NWW775KEIDF6SU6PL";
const STORAGE_URL = `https://remote-storage.developerakademie.org/item`;


let tasks = [];
let contacts_global = [];
let currentUser = [];
let currentUserId = '';
let users = [];
let newTask_status = false;

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
  console.log('Received User by ID from backend:', data); 
  return data;
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


// ***** current_user ***** //


/**
 * Loads the currentUser from Server and save this in curentUser @storage.js.
 * 
 * @returns {JSON} - currentUser
 */
async function getCurrentUserIdFromServer() {
  const url = `http://127.0.0.1:8000/api/current_user/`;
  const res = await fetch(url);
  const data = await res.json();
  console.log('Received Current User Id from backend:', data); 
  currentUserId = data[0].currentUserIndex;
  return currentUserId;
}

/**
 * Saves the currentUser data to server.
 * 
 * @param {Integer} current_userIndex 
 * @returns res.json()
 */
async function saveCurrentUserIdOnServer() {
  const url = `http://127.0.0.1:8000/api/current_user/1/`;

  if (typeof currentUserId !== "number") {
    console.error("Invalid currentUserId:", currentUserId);
    return;
  }

  return fetch(url, {
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      currentUserIndex: currentUserId,
    }),
  }).then(res => {
    if (!res.ok) {
      return res.json().then(err => {
        console.error("Backend error:", err);
        throw new Error(`Error while saving the current user: ${res.status}`);
      });
    }
    return res.json();
  });
}


// ***** tasks ***** //

async function getTasksOfServer() {
  const url = `http://127.0.0.1:8000/api/tasks/`;
  const res = await fetch(url);
  const data = await res.json();
  console.log('Received Tasks from backend:', data); 
  tasks = data;
  return data;
}

async function savesTasksOnServer(taskId) {
  const url = `http://127.0.0.1:8000/api/tasks/${taskId}/`;
  const taskData = tasks[taskId];

  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskData),
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Error while saving the task: ${res.status}`);
    }
    return res.json();
  });
}

async function deleteTask(taskId) {
  const url = `http://127.0.0.1:8000/api/tasks/${taskId}/`;
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Error while deleting the task: ${res.status}`);
    }
    return res.json();
  }).catch(err => {
    console.error('Error deleting task:', err);
  });
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

/**
 * Saves and loads the tasks to and from server.
 */
async function setAndGetToServer(taskId) {
  await savesTasksOnServer(taskId);
  await getTasksOfServer();
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
  console.log('Received Contacts from backend:', data); 
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


// ***** newTAsk status ***** //


/**
 * Load the tasks JSON Array from Server in tasks[]
 */
async function getNewTask_statusFromServer() {
  const url = `http://127.0.0.1:8000/api/task_status/`;
  const res = await fetch(url);
  const data = await res.json();
  console.log('Received task_status from backend:', data); 
  if (data.length === 0) {
    console.warn('No task_status object found!');
    return;
  }
  newTask_status = data[0].status;
  return newTask_status;
}

/**
 * Saves the new task status to server.
 */
async function saveNewTask_statusOnServer() {
  const url = `http://127.0.0.1:8000/api/task_status/1/`;

  if (typeof newTask_status !== "boolean") {
    console.error("Invalid task_status:", newTask_status);
    return;
  }
  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: newTask_status,
    }),
  }).then(res => {
    if (!res.ok) {
      return res.json().then(err => {
        console.error("Backend error:", err);
        throw new Error(`Error while saving the new_Task_status: ${res.status}`);
      });
    }
    return res.json();
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
 * Push new Content to Server
 */
async function setUserToServer() {
  await setItem('users', accounts);   
}

/**
 * Load the tasks JSON Array from Server in tasks[]
 */
async function getAccountsFromServer() {
  try {
    let ServerData;
    ServerData = await getItem("users");
    let newData = JSON.parse(ServerData.data.value);
    accounts = newData;
  } catch (e) {
    console.warn("Could not load accounts!");
  }
}

/**
 * Deletes acoount bei set the Index of account from users
 * 
 * @param {Number} account_index - Index of account to delete from Server
 */
async function deleteAccount(account_index) {
  await getAccountsFromServer();
  accounts.splice(account_index,1);
  await setItem('users', accounts);
  await getAccountsFromServer();
}

/**
 * Add the new user to contact list of contacts.html.
 * 
 * @param {String} firstName 
 * @param {String} secondName 
 * @param {String} mail 
 * @param {String} password 
 */
async function creatNewUserIntern(firstName, secondName, mail, password) {
  await getAccountsFromServer();
  accounts.push({
    name: {
      firstName: firstName,
      secondName: secondName,
      color: "#ff4646",
    },
    mail: mail,
    password: password,
    lockedIn: false,
  });
  await setItem('users', accounts);
  await getAccountsFromServer();
}

/**
 * status of new task.
 */
statusBymobile_addTask_board = "toDo";

/**
 * Push status for new task to Server
 */
async function setStatusToServer() {
  await setItem('status', statusBymobile_addTask_board);   
}

/**
 * Load status for new task from Server 
 */
async function getStatusFromServer() {
  try {
    let ServerData;
    ServerData = await getItem('status');
    let newData = ServerData.data.value;
    statusBymobile_addTask_board = newData;
  } catch (e) {
    console.warn("Could not load status for new task!");
  }
}


/**
 * Sets key with value on Server with own token.
 * 
 * @param {String} key 
 * @param {String} value 
 * @returns 
 */
// async function setItem(key, value) {
//   const payload = { key, value, token: STORAGE_TOKEN };
//   return fetch(STORAGE_URL, {
//     method: "POST",
//     body: JSON.stringify(payload),
//   }).then((res) => res.json());
// }

/**
 * Get Value of Key from Server
 * 
 * @param {String} key - Name of Storage that is saved on server
 * @returns {JSON} 
 */
// async function getItem(key) {
//   const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
//   return fetch(url)
//     .then((res) => res.json())
// }
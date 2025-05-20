let mail = document.getElementById("mail");
let password = document.getElementById("password");

/**
 * Loads the user data from server.
 * Loads the contacts data from server.
 * Compares user data with input, saves by match the user at currentUser and forward to summary.
 * By not matching appears the message "E-Mail or Password not exist".
 */
async function handleLogIn() {
  await checkExistingUser(); // set currentUser
  if (currentUser == "") {
    showToastMessage_UserOrMailNotExist();
  } else {
    await setCurrentUserId(); // set currentUserId
    await setLogIn_statusOfCurrentUser(); // set logIn status of currentUser in contacts_global
    setInterval(() => {
      window.location.href = "summary.html";
    }, 750);
  }
}

/**
 * Iterates through users[] and compares the input values with content of users.
 * By match currentUser is filled with matched user data.
 */
async function checkExistingUser() {
  await loadUsers();
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    // comparing of users vs. inputfields
    if (user.mail == mail.value && user.password == password.value) {
      currentUser = JSON.parse(JSON.stringify(user));
      await saveCurrentUserOnServer();
      await getCurrentUserIdFromServer();
    }
  }
}

/**
 * Gets the account data from Server and save this at users[] @storage.js.
 */
async function loadUsers() {
  try {
    let ServerData;
    ServerData = await getUsersFromServer();
    let newData = ServerData.data;
    users = JSON.parse(JSON.stringify(newData));
  } catch (e) {
    console.warn("Could not load users!");
  }
}

/**
 * Sets and saves Index of currentUser in contacts_global at variable currentUserId.
 */
async function setCurrentUserId() {
  currentUserId = await findIndexOfCurrentUserInContacts_Global();
  await saveCurrentUserIdOnServer();
  await getCurrentUserIdFromServer();
  console.log(`currentUserId: ${currentUserId}`);
}

/**
 * Finds the Index of currentUser in contacts_global.
 *
 * @returns {Number} - Index of currentUser data in contacts_global
 */
async function findIndexOfCurrentUserInContacts_Global() {
  await getContactsFromServer();
  let index = contacts_global.findIndex(
    (contact) =>
      contact.first_name === currentUser.first_name &&
      contact.second_name === currentUser.second_name
  );
  return index;
}

/**
 * Loads the Contacts from Server in contacts_global.
 * Finds the Index of currentUser in contacts_global.
 * Sets all lockedIn of contacts in contacts_global on false.
 * If currentUser is available in contacts_global,
 * lockedIn of the contact, which is equal to the currentUser, is set to true.
 */
async function setLogIn_statusOfCurrentUser() {
  resetLogIn_status();
  await setNewLogIn_status();
}

/**
 * Iterates through contacts_global and set all "lockedIn" keys to false.
 */
function resetLogIn_status() {
  for (let i = 0; i < contacts_global.length; i++) {
    contacts_global[i].lockedIn = false;
  }
}

/**
 * Iterates through contacts_global. If a currentUser exist, compares the function the contacts with currentUser.
 * By match the lockedIn_status is true.
 * Saves the changes at server.
 */
async function setNewLogIn_status() {
  let contact = contacts_global[currentUserId];
  contact.lockedIn = true;
  await setContactsToServer();
  await getContactsFromServer();
}

/* Gueat Login */

/**
 *
 */
async function handleGuestLogIn() {
  await setCurrentUserToGuest()
  window.location.href = "summary.html";
}

async function setCurrentUserToGuest() {
  currentUserId = 1;
  await saveCurrentUserIdOnServer();
  currentUser = await getUserById(currentUserId);
  console.log('currentUser: ', currentUser);
}

/* Toast Message */

/**
 * Shows the toast message "E-Mail or Password not exist" for 3 seconds.
 */
async function showToastMessage_UserOrMailNotExist() {
  // mail.value = '';
  // password.value = '';
  await openToastMessageIndex();
  await timeout(3000);
  await closeToast();
}

/**
 * Makes the element saying "E-Mail or Password not exist" appear.
 */
function openToastMessageIndex() {
  let container = document.getElementById("toastMessage_Index");
  container.classList.remove("d-none");
}

/**
 * Starts a timeout.
 *
 * @param {Number} ms - Time of timeout
 * @returns {TimeRanges}
 */
function timeout(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Hides the toast message box saying "E-Mail or Password not exist"
 */
function closeToast() {
  let container = document.getElementById("toastMessage_Index");
  container.classList.add("d-none");
}

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
  await getUsersOfServer();
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    // comparing of users vs. inputfields
    if (user.mail == mail.value && user.password == password.value) {
      currentUser = user;
      currentUserId = user.id;
      saveCurrentUserIdInSessionStorage(currentUserId)
      await getCurrentUserIdFromSessionStorage();
    }
  }
}

/**
 * Sets and saves Index of currentUser in contacts_global at variable currentUserId.
 */
async function setCurrentUserId() {
  currentUserId = await findIndexOfCurrentUserInContacts_Global();
  saveCurrentUserIdInSessionStorage(currentUserId);
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
  await updateLockedIn(currentUserId, true)
  await getUsersOfServer()
}


/**
 * Sucht den Index eines Benutzers im users-Array anhand der ID.
 * 
 * @param {Number} searchId - Die gesuchte Benutzer-ID
 * @returns {Number|null} - Der Index im Array oder null, wenn nicht gefunden
 */
function findUserIndexById(searchId) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === searchId) {
      return i;
    }
  }
  return null; // Falls kein passender User gefunden wurde
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
  saveCurrentUserIdInSessionStorage(currentUserId);
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

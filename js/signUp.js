
let passwordCheckStatus;
let checkbox = document.getElementById("checkbox");
let password_message = document.getElementById("password_message");
let confirm_password = document.getElementById("confirm_password");
let firstName;
let secondName;
let register_btn = document.getElementById("register_btn");
let userName = document.getElementById("name");
let mail = document.getElementById("mail");
let password = document.getElementById("password");
let registerSuccessfull = document.getElementById("register_successfull");
let nameValidation = false;

async function init() {
  getUsersOfServer()
}


async function register() {
  checkName();
  if (checkName() == true) {
    comparePassword();
    if (passwordCheckStatus) {
      splitName(userName);
      register_btn.disabled = true;
      creatNewUser(firstName, secondName, mail.value, password.value);
      createNewUser(newUser)
      resetForm();
      registerSuccessfull.classList.remove("d-none");
      registerSuccessfull.innerHTML = "<h2>You Signed Up successfully</h2>";
      setInterval(() => {
        window.location.href = "index.html";
      }, 800);
    } else {
      document.getElementById("password_message").innerHTML =
      "Passwords do not match. Please check and try again!";
    }
  } else {
    window.location.hash = 'name';
  }
}

/**
 * Checks if the name is valid.
  * The name is valid if it is not empty and contains a space.
  * If the name is valid, it returns true and hides the error message.
  * If the name is not valid, it returns false and shows the error message.
 * 
 * @returns {Boolean} - Marks whether the name is valid or not.
 */
function checkName() {
  let fullName = document.getElementById('name').value.trim();
  let error_div = document.getElementById('errormessage_signup');
  let inputName = document.getElementById('name');
  if (fullName !== '' && fullName.includes(' ')) {
    error_div.style.display = 'none';
    inputName.style.borderColor = '#ccc';
    return true;
  } else {
    error_div.style.display = 'flex';
    inputName.style.borderColor = '2px solid #ff0000 !important';
    return false;
  }
}

async function saveNewUser() {
  users.push({
    first_name: firstName,
    second_name: secondName,
    color: "#ff4646",
    mail: mail.value,
    password: password.value,
    lockedIn: false,
 });
 await createNewUser(users);
}

async function createContact() {
  await getContactsFromServer();
  let newContact = {
    "first_name": firstName,
    "second_name": secondName,
    "color": "#ff4646",
    "mail": mail.value,
    "phone": '',
    "locked_in": false
};
  contacts_global.push(newContact);
  sortPerson();
  await setContactsToServer();
  await getContactsFromServer();
}

function sortPerson() {
  contacts_global.sort(function (a, b) {
      let nameA = (a.first_name + ' ' + a.second_name).toUpperCase();
      let nameB = (b.first_name + ' ' + b.second_name).toUpperCase();
      if (nameA < nameB) {
          return -1;
      }
      if (nameA > nameB) {
          return 1;
      }
      return 0;
  });
}

function comparePassword() {
  if (
    document.getElementById("password").value ==
    document.getElementById("confirm_password").value
    ) {
      document.getElementById("password_message").style.color = "green";
      document.getElementById("password_message").innerHTML = "Password match!";
      passwordCheckStatus = true;
  } else {
    document.getElementById("password_message").style.color = "red";
    document.getElementById("password_message").innerHTML =
      "Password do not match!";
    passwordCheckStatus = false;
  }
}

function splitName(userName) {
  let splittedName = userName.value.split(" ");
  firstName = splittedName[0];
  secondName = splittedName[1];
}

function resetForm() {
  userName.value = "";
  mail.value = "";
  password.value = "";
  confirm_password.value = "";
  password_message.innerHTML = "";
  checkbox.checked = false;
  register_btn.disabled = false;
}

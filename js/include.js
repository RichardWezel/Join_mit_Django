/**
 * Includes templates on the site as sidebar.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[template-src]");

  for (let element of includeElements) {
    let file = element.getAttribute("template-src");
    let response = await fetch(file);
    if (response.ok) {
      let text = await response.text();
      element.innerHTML = text;
    } else {
      element.innerHTML = "Page not found.";
    }
  }
  setActiveLink();
}

/**
 * Marks the current html webpage on the sidebar with a different background-color.
 */
function setActiveLink() {
  let url = window.location.href;
  let links = document.querySelectorAll('.side_navbar_section');
  links.forEach(function(link) {
    if (url.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });
}

/**
 * Sets the initials of the current user in the header.
 */
async function setUserInitialsAtHeader() {
  let currentUserId = getCurrentUserIdFromSessionStorage();
  let firstName = currentUser.first_name;
  let secondName = currentUser.second_name;
  if (currentUser.length === 0 || typeof currentUser == "undefined" || currentUser == '' || currentUserId == 1) {
    let accountLogo = document.getElementById('navbarHeadIcon');
    accountLogo.innerHTML = 'G';
  } else if (typeof currentUser.second_name == "undefined" || typeof currentUser.second_name == '') {
    fallbackInitialsNoSecondName(firstName)
  } else {
    setInitialsFirstAndSecondChar(firstName, secondName);
  }
}

/**
 * Sets the initials of the current user in the header when there is no second name.
 * 
 * @param {String} firstName - First name of the current user
 */
function fallbackInitialsNoSecondName(firstName) {
  let accountLogo = document.getElementById('navbarHeadIcon');
  let firstNameChar = firstName.charAt(0);
    accountLogo.innerHTML = `${firstNameChar}`;
}

/**
 * Sets the initials of the current user in the header with the first character of the first and second name.
 * 
 * @param {String} firstName - First name of the current user
 * @param {String} secondName - Second name of the current user
 */
function setInitialsFirstAndSecondChar(firstName, secondName) {
  let accountLogo = document.getElementById('navbarHeadIcon');
  let firstNameChar = firstName.charAt(0);
  let secondNameChar = secondName.charAt(0);
  accountLogo.innerHTML = `${firstNameChar} ${secondNameChar}`;
}
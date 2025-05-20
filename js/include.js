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
 * Sets the initials of logged account in the head navbar in the top right corner.
 * currentUser is an Array in storage.js.
 */
async function setUserInitialsAtHeader() {
  let accountLogo = document.getElementById('navbarHeadIcon');
  if (currentUser.length === 0 || typeof currentUser == "undefined" || currentUser == '' || currentUserId == 1) {
    accountLogo.innerHTML = 'G';
  } else if (typeof currentUser.second_name == "undefined" || typeof currentUser.second_name == '') {
    let firstName = currentUser.first_name;
    firstName = firstName.charAt(0);
    accountLogo.innerHTML = `${firstName}`;
  } else {
    let firstName = currentUser.first_name;
    firstName = firstName.charAt(0);
    let secondName = currentUser.second_name;
    secondName = secondName.charAt(0);
    accountLogo.innerHTML = `${firstName} ${secondName}`;
  }
}
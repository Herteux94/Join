let addSubtasks = [];
let currentPriority;
let categorySet = ["Technical Task", "User Story"];
var activePriority = null;
let addMembersValueArray = [];
let addMembersStatusArray = [];
let selectedCategoryInput;
let statusMembers = [];
let addMembers = [];

/**
 * Initializes the page.
 * @returns {Promise<void>} A Promise object.
 */

async function onload() {
  await init();
  await includeHTML();
  displayUserProfile();
  setTodayDate();
  addStatusToMembers();
  addTaskFocused();
}

function addTaskFocused() {
  document.getElementById("addTaskSidemenu").classList.add("sideMenuInFocus");
}

/**
 * Sets today's date in the due date input field.
 */
function setTodayDate() {
  var today = new Date().toISOString().split("T")[0];
  var dueDateInput = document.getElementById("dueDateMainAddTask");
  dueDateInput.setAttribute("min", today);
}

/**
 * Validates the selected date in the input field 'dueDateMainAddTask'.
 * If the selected date is in the past, it displays an alert and clears the input field.
 * This function is triggered when the input field loses focus.
 *
 * @returns {void}
 */
function validateSelectedDate() {
  var inputDate = document.getElementById("dueDateMainAddTask").value;
  if (inputDate.length === 10) {
    var selectedDate = new Date(inputDate);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      dateAlert();
      document.getElementById("dueDateMainAddTask").value = "";
    }
  }
}

/**
 * Displays an alert message "Please pick a future date!" for three seconds in the 'alertDate' element.
 *
 * @returns {void}
 */
function dateAlert() {
  var alertDate = document.getElementById("alertDate");
  if (alertDate) {
    alertDate.innerText = "Please pick a future date!";
    setTimeout(function () {
      alertDate.innerText = "";
    }, 3000);
  }
}

/**
 * Adds an event listener to the document that triggers when the DOM content is fully loaded.
 * Calls the 'setTodayDate' function to set the minimum date for the due date input field.
 * Additionally, adds an event listener to the 'dueDateMainAddTask' input field.
 * When the input field loses focus, it triggers the 'validateSelectedDate' function to ensure
 * that the selected date is today or in the future.
 *
 * @param {string} type - The event type to listen for ('DOMContentLoaded').
 * @param {function} listener - The callback function to execute when the event is triggered.
 * @returns {undefined}
 */
document.addEventListener("DOMContentLoaded", function () {
  setTodayDate();
  document.getElementById("dueDateMainAddTask").onblur = validateSelectedDate;
});

/**
 * Handles the form submission event for adding a task.
 * Displays alert messages if required fields are empty or if a valid category is not selected.
 *
 * @param {Event} event - The form submission event.
 * @returns {void}
 */
function handleTaskForm(event) {
  event.preventDefault();
  if (titleMainAddTask.value === "") {
    alertTitel();
    return;
  }
  if (dueDateMainAddTask.value === "") {
    alertDate();
    return;
  }
  if (currentPriority === undefined) {
    alertPrio();
    return;
  }
  if (
    selectedCategoryInput !== "User Story" &&
    selectedCategoryInput !== "Technical Task"
  ) {
    alertCategory();
    return;
  }
  continueTaskFormHandling();
}

/**
 * Handles the remaining task form handling process after all validations are passed.
 *
 * @returns {void}
 */
function continueTaskFormHandling() {
  if (
    selectedCategoryInput !== "User Story" &&
    selectedCategoryInput !== "Technical Task"
  ) {
    var alertMessage = document.getElementById("alertCategory");
    alertMessage.innerHTML = "Please select a valid category!";
  } else {
    fillArray();
    togglePriority(activePriority);
    clearAddTaskFloating();
    showAlert();
  }
}

/**
 * Displays an alert if no title is entered.
 */

function alertTitel() {
  // Define the alert message
  var alertMessageTitle = "Please select a Titel!";
  // Display the alert message in the HTML element with the ID 'alertTitle'
  document.getElementById("alertTitle").innerHTML = alertMessageTitle;
  // Clear the alert message after 3 seconds
  setTimeout(function () {
    document.getElementById("alertTitle").innerHTML = "";
  }, 3000); // Delay of 3 seconds (3000 milliseconds)
}

/**
 * Displays an alert if no due date is selected.
 */

function alertDate() {
  // Define the alert message
  var alertMessageDate = "Please select a Due Date!";
  // Display the alert message in the HTML element with the ID 'alertDate'
  document.getElementById("alertDate").innerHTML = alertMessageDate;
  // Clear the alert message after 3 seconds
  setTimeout(function () {
    document.getElementById("alertDate").innerHTML = "";
  }, 3000); // Delay of 3 seconds (3000 milliseconds)
}

/**
 * Displays an alert if no priority is selected.
 */

function alertPrio() {
  // Define the alert message
  var alertMessagePriority = "Please select a priority!";
  // Display the alert message in the HTML element with the ID 'alertPrio'
  document.getElementById("alertPrio").innerHTML = alertMessagePriority;
  // Clear the alert message after 3 seconds
  setTimeout(function () {
    document.getElementById("alertPrio").innerHTML = "";
  }, 3000); // Delay of 3 seconds (3000 milliseconds)
}

/**
 * Displays an alert if no category is selected.
 */

function alertCategory() {
  // Define the alert message
  var alertMessageCategory = "Please select a category!";
  // Display the alert message in the HTML element with the ID 'alertCategory'
  document.getElementById("alertCategory").innerHTML = alertMessageCategory;
  // Clear the alert message after 3 seconds
  setTimeout(function () {
    document.getElementById("alertCategory").innerHTML = "";
  }, 3000); // Delay of 3 seconds (3000 milliseconds)
}

/**
 * Fills the array with the entered task information.
 */

function fillArray() {
  let countIDs = countIds();
  let addTitleValue = addTitleToBoard();
  let addDescriptionValue = addDescriptionToBoard();
  let addDueDateInput = addDueDateToBoard();
  let addSubtaskStatus = addDoneToBoard();
  let newToDo = {
    id: `${countIDs}`,
    box: "toDoTasks",
    title: `${addTitleValue}`,
    description: `${addDescriptionValue}`,
    category: selectedCategoryInput,
    dueDate: `${addDueDateInput}`,
    members: addMembers,
    status: statusMembers,
    subtasks: addSubtasks,
    done: addSubtaskStatus,
    priority: currentPriority,
  };
  pushToDo(newToDo);
  clearAddTaskFloating();
}

/**
 * Adds a new task to the tasks array.
 * @param {object} newToDo - The object of the new task.
 * @returns {Promise<void>} A Promise object.
 */

async function pushToDo(newToDo) {
  mainUserInfos[0]["tasks"].push(newToDo);
  await setItem(`${currentUserMail}`, JSON.stringify(mainUserInfos));
  addMembersValueArray = [];
  addSubtasks = [];
  addMembersValue = [];
}

/**
 * Shows the priority icons based on the selected priority.
 * @param {string} priority - The selected priority.
 */

function showIconsPrio(priority) {
  ["low", "medium", "urgent"].forEach((prio) => {
    if (prio === priority) {
      document.getElementById(`${prio}IconGray`).classList.remove("dNone");
      document.getElementById(`${prio}IconColor`).classList.add("dNone");
    } else {
      document.getElementById(`${prio}IconGray`).classList.add("dNone");
      document.getElementById(`${prio}IconColor`).classList.remove("dNone");
    }
  });
}

/**
 * Renders contacts on the board.
 */

function renderContactsOnBoard() {
  document.getElementById("listContactContainerMain").innerHTML = ``;
  let contactBoard = document.getElementById("listContactContainerMain");
  if (contactBoard.classList.contains("dNone")) {
    contactBoard.classList.remove("dNone");
    contactBoard.classList.add("dFlex");
  } else {
    contactBoard.classList.add("dNone");
    contactBoard.classList.remove("dFlex");
  }
  if (mainUserInfos[0]["contactBook"]) {
    renderContactbook();
  }
}

function renderContactbook() {
  let contactBoard = document.getElementById("listContactContainerMain");
  for (let i = 0; i < mainUserInfos[0]["contactBook"].length; i++) {
    contactBoard.innerHTML += `
  <div class="contactsBoardContainer" onclick="checkCheckbox(${i})" onchange="updateStatus(${i})">
      <div class="contactsBoardContainerChild">   
          <div class="styleMembersAddTask" id="profilMemberMain${i}"></div>
          <span class="nameMember" id="nameMemberMain${i}"></span>
      </div>
      <input class="customCheckbox" id="checkboxMember${i}" type="checkbox" onclick="checkCheckbox(${i})" onchange="updateStatus(${i})">
  </div>
  `;
    fillContactsOnBoard(i);
  }
  assignRandomBackgroundColor();
  addCheckboxStatus();
}
/**
 * Adds checkbox status.
 */

function addCheckboxStatus() {
  for (let i = 0; i < mainUserInfos[0]["contactBook"].length; i++) {
    let checkbox = document.getElementById(`checkboxMember${i}`);
    checkbox.checked = statusMembers[i];
  }
}

/**
 * Updates  the status of the contact
 * @param {number} i - The index of the contact.
 */

function updateStatus(i) {
  let checkbox = document.getElementById(`checkboxMember${i}`);
  if (checkbox.checked) {
    statusMembers[i] = true;
  } else {
    statusMembers[i] = false;
  }
}

/**
 * Adds status to members.
 */

function addStatusToMembers() {
  addMembers = [];
  statusMembers = [];
  let contacts = mainUserInfos[0]["contactBook"];
  for (let i = 0; i < contacts.length; i++) {
    let addContact = contacts[i]["name"];
    addMembers.push(addContact);
    statusMembers.push(false);
  }
}

/**
 * Fills the contact list on the board.
 * @param {number} i - The index of the contact.
 */

function fillContactsOnBoard(i) {
  // Extract the full name of the contact from mainUserInfos using the provided index i
  const fullName = mainUserInfos[0]["contactBook"][i]["name"];
  // Extract the initials from the full name
  const initials = fullName
    .split(" ")
    .map((word) => word.slice(0, 1).toUpperCase())
    .join("");
  // Set the HTML content of elements with specific IDs to display the initials and full name of the contact
  document.getElementById(`profilMemberMain${i}`).innerHTML = initials; // Display initials
  document.getElementById(`nameMemberMain${i}`).innerHTML = fullName; // Display full name
}

/**
 * Assigns random background colors to profile images.
 */
function assignRandomBackgroundColor() {
  const elementsWithProfilMember = document.querySelectorAll(
    '[id^="profilMember"]'
  );
  const elementsWithSelectedProfilOnBoard = document.querySelectorAll(
    '[id*="selectedProfilOnBoard"]'
  );
  elementsWithProfilMember.forEach((element) => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    element.style.backgroundColor = randomColor;
  });
  elementsWithSelectedProfilOnBoard.forEach((element) => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    element.style.backgroundColor = randomColor;
  });
}

/**
 * Handles the value of the subtask input and updates the UI accordingly.
 */

function valueSubtask() {
  var input = document.getElementById("subTaskInputMain").value;
  if (input.length > 0) {
    let valueSubtask = document.getElementById("subTaskInputMain").value;
    addSubtasks.push(valueSubtask);
    valueSubtask.innerHTML = "";
    document.getElementById("subtaskListMain").innerHTML = "";
    for (let i = 0; i < addSubtasks.length; i++) {
      document.getElementById("subtaskListMain").innerHTML += `
  <div id="valueSubtaskContainer${i}" class="valueSubtaskContainer"  ondblclick="editSubtask(${i})">
    <li>${addSubtasks[i]}</li>
    <div class="editDeleteSubtaskIconContainer">
      <img src="assets/img/edit.svg" alt="edit icon" id="editSubtaskIcon" onclick="editSubtask(${i})">
      <div class="seperaterSubtasks"></div>
      <img src="assets/img/delete.svg" alt"delete icon" id="deleteSubtaskIcon" onclick="deleteSubtask(${i})">
    </div>
  </div>  
    `;
    }
  } else {
    alertMessageTitel();
  }
}

/**
 * Displays an alert message for subtask title input.
 *
 * @returns {void}
 */
function alertMessageTitel() {
  var alertMessageTitle = "Please enter a Letter";
  document.getElementById("alertSubtask").innerHTML = alertMessageTitle;
  setTimeout(function () {
    document.getElementById("alertSubtask").innerHTML = "";
  }, 3000);
}

/**
 * Counts the unique ids for tasks.
 * @returns {number} The unique id.
 */

function countIds() {
  if (mainUserInfos[0]["tasks"].length === 0) {
    return 0;
  } else {
    let ids = new Set(
      mainUserInfos[0]["tasks"].map((task) => parseInt(task["id"]))
    );
    for (let i = 0; i < 100; i++) {
      if (!ids.has(i)) {
        return i;
      }
    }
  }
}

/**
 * Retrieves the title to be added to the board.
 * @returns {string} The title input value.
 */

function addTitleToBoard() {
  let addTitleInput = document.getElementById("titleMainAddTask");
  if (addTitleInput) {
    return addTitleInput.value;
  } else {
    return "";
  }
}

/**
 * Retrieves the description to be added to the board.
 * @returns {string} The description input value.
 */

function addDescriptionToBoard() {
  let addDescriptionInput = document.getElementById("descriptionMainAddTask");
  if (addDescriptionInput) {
    return addDescriptionInput.value;
  } else {
    return "";
  }
}

/**
 * Retrieves the due date to be added to the board.
 * @returns {string} The due date input value.
 */

function addDueDateToBoard() {
  let addDueDateInput = document.getElementById("dueDateMainAddTask").value;
  if (addDueDateInput) {
    return addDueDateInput;
  } else {
    return "";
  }
}

/**
 * Retrieves the status of subtasks to be added to the board.
 * @returns {Array<string>} The array of subtask status.
 */

function addDoneToBoard() {
  let addSubtaskStatus = [];
  for (let j = 0; j < addSubtasks.length; j++) {
    let firstStatus = "false";
    addSubtaskStatus.push(firstStatus);
  }
  return addSubtaskStatus;
}

/**
 * Retrieves the members to be added to the task.
 * @returns {Array<string>} The array of members.
 */

function addMembersToTask() {
  let addMembersValue = [];
  for (let i = 0; i < addMembersStatusArray.length; i++) {
    let element = addMembersStatusArray[i];
    if (element === true) {
      addMembersValue.push(addMembersValueArray[i]);
    }
  }
  return addMembersValue;
}

/**
 * Clears the input fields related to adding a task.
 */

function clearAddTaskFloating() {
  document.getElementById("titleMainAddTask").value = "";
  document.getElementById("descriptionMainAddTask").value = "";
  document.getElementById("dueDateMainAddTask").value = "";
  document.getElementById("assignedInputMain").innerHTML = "";
  document.getElementById("categoryInput").value = "";
  document.getElementById("subTaskInputMain").value = "";
  document.getElementById("subtaskListMain").innerHTML = "";
}

/**
 * Toggles the priority of a task.
 * @param {number} priority - The priority value.
 */

function togglePriority(priority) {
  if (activePriority === priority) {
    activePriority = null;
  } else {
    if (activePriority !== null) {
      document
        .getElementsByTagName("button")
        [activePriority - 1].classList.remove("active");
    }
    activePriority = priority;
  }
}

/**
 * Pushes members to the task.
 */

function pushMembers() {
  for (let i = 0; i < mainUserInfos[0]["contactBook"].length; i++) {
    let addMembersValue = mainUserInfos[0]["contactBook"][i]["name"];
    addMembersValueArray.push(addMembersValue);
    addMembersStatusArray.push("false");
  }
}

/**
 * Changes the icons for subtasks and handles their functionalities.
 */

function changeIconsSubtask() {
  // Get the container for icons
  let iconsContainer = document.getElementById("iconContainerSubtasks");
  // Update the HTML content with new icons and their functionalities
  iconsContainer.innerHTML = `
  <img src="assets/img/subtaskiconsclose.svg" alt="close img" onclick="changeIconsSubtaskBack()">
  <div class="seperaterSubtasks"></div>
  <img src="assets/img/subtaskiconsadd.svg" alt="add img" onclick="valueSubtask(), changeIconsSubtaskBack()">
  `;
}

/**
 * Changes the icons for subtasks back to the original state and clears the subtask input.
 */

function changeIconsSubtaskBack() {
  let inputContainer = document.getElementById("subTaskInputMain");
  let iconsContainer = document.getElementById("iconContainerSubtasks");
  // Restore the original icon and clear the input field
  iconsContainer.innerHTML = `
  <img id="subTaskMain" onclick="changeIconsSubtask()" src="assets/img/Subtask's icons.png" class="dropdown-icon">
  `;
  inputContainer.value = "";
}

/**
 * Displays technical categories for selection.
 */

function technicalUserMain() {
  let technical = document.getElementById("listTechnicalMain");
  technical.classList.remove("dNone");
  technical.innerHTML = "";
  // Populate technical categories for selection
  for (let k = 0; k < categorySet.length; k++) {
    technical.innerHTML += `<div class="select" onclick="chosenTechnicalUserMain('${categorySet[k]}')">${categorySet[k]}</div>`;
  }
}

/**
 * Toggles the display of technical categories dropdown.
 */

function toggleCategory() {
  addStatusToMembers();
  var listTechnical = document.getElementById("listTechnicalMain");
  var categoryDropdown = document.getElementById("categoryDropdownMain");

  if (
    listTechnical.style.display === "none" ||
    listTechnical.style.display === ""
  ) {
    listTechnical.style.display = "block";
    categoryDropdown.src = "assets/img/arrow_drop_up.png";
  } else {
    listTechnical.style.display = "none";
    categoryDropdown.src = "assets/img/arrow_drop_down.png";
  }
}

/**
 * Sets the chosen technical category as the input value.
 * @param {string} category - The selected category.
 */

function chosenTechnicalUserMain(category) {
  document.getElementById("categoryInput").value = `${category}`;
  selectedCategoryInput = category;
}

/**
 * Displays an alert notification.
 */

function showAlert() {
  var customAlert = document.getElementById("addedTask");
  customAlert.classList.add("show"); // Add CSS class to show the alert
  setTimeout(function () {
    customAlert.style.animation = "flyOutToLeft 1s forwards"; // Start the animation
    setTimeout(function () {
      customAlert.classList.remove("show"); // Remove CSS class to hide the alert
      customAlert.style.animation = ""; // Setzt die Animation zurück
    }, 1000); // Wait for 1 second before hiding the alert
  }, 3000); // Wait for 3 seconds before starting the animation
}

/**
 * Enables editing of a subtask.
 * @param {number} i - The index of the subtask to edit.
 */

function editSubtask(i) {
  document.getElementById(`valueSubtaskContainer${i}`).innerHTML = `
  <input value="${addSubtasks[i]}" id="inputEditSubtask${i}" class="inputEditSubtaskInProcess">
  <div class="editDeleteSubtaskIconContainerInProcess">
    <img src="assets/img/delete.svg" alt="edit icon" id="editSubtaskIcon" onclick="deleteChanges(${i})">
    <div class="seperaterSubtasks"></div>
    <img src="assets/img/check.svg" alt"delete icon" id="deleteSubtaskIcon" onclick="acceptChanges(${i})">
  </div>
  `;
}

/**
 * Deletes a subtask.
 * @param {number} i - The index of the subtask to delete.
 */

function deleteSubtask(i) {
  var elementToRemove = document.getElementById(`valueSubtaskContainer${i}`);
  elementToRemove.remove();
  addSubtasks.splice(i, 1);
  let clear = document.getElementById("subtaskListMain");
  clear.innerHTML = "";
  for (let j = 0; j < addSubtasks.length; j++) {
    document.getElementById("subtaskListMain").innerHTML += `
  <div id="valueSubtaskContainer${j}" class="valueSubtaskContainer">
    <li>${addSubtasks[j]}</li>
    <div class="editDeleteSubtaskIconContainer">
      <img src="assets/img/edit.svg" alt="edit icon" id="editSubtaskIcon" onclick="editSubtask(${j})">
      <div class="seperaterSubtasks"></div>
      <img src="assets/img/delete.svg" alt"delete icon" id="deleteSubtaskIcon" onclick="deleteSubtask(${j})">
    </div>
  </div>  
    `;
  }
}

/**
 * Reverts changes made to a subtask.
 * @param {number} i - The index of the subtask to revert changes.
 */

function deleteChanges(i) {
  document.getElementById(`valueSubtaskContainer${i}`).innerHTML = `

  <li>${addSubtasks[i]}</li>
    <div class="editDeleteSubtaskIconContainer">
      <img src="assets/img/edit.svg" alt="edit icon" id="editSubtaskIcon" onclick="editSubtask(${i})">
      <div class="seperaterSubtasks"></div>
      <img src="assets/img/delete.svg" alt"delete icon" id="deleteSubtaskIcon" onclick="deleteSubtask(${i})">
    </div>
  </div>`;
}

/**
 * Accepts changes made to a subtask.
 * @param {number} i - The index of the subtask to accept changes.
 */

function acceptChanges(i) {
  let newValue = document.getElementById(`inputEditSubtask${i}`).value;
  addSubtasks[i] = newValue;
  document.getElementById(`valueSubtaskContainer${i}`).innerHTML = `
  <li>${addSubtasks[i]}</li>
    <div class="editDeleteSubtaskIconContainer">
      <img src="assets/img/edit.svg" alt="edit icon" id="editSubtaskIcon" onclick="editSubtask(${i})">
      <div class="seperaterSubtasks"></div>
      <img src="assets/img/delete.svg" alt"delete icon" id="deleteSubtaskIcon" onclick="deleteSubtask(${i})">
    </div>
  `;
}

/**
 * Clears all fields related to adding a task.
 */

function clearCurrentall() {
  statusMembers = [];
  addMembers = [];
  document.getElementById("titleMainAddTask").value = "";
  document.getElementById("descriptionMainAddTask").value = "";
  document.getElementById("dueDateMainAddTask").value = "";
  document.getElementById("assignedInputMain").innerHTML = "";
  document.getElementById("categoryInput").value = "";
  document.getElementById("subTaskInputMain").value = "";
  document.getElementById("subtaskListMain").innerHTML = "";
}

/**
 * Handles the click event for priority selection.
 * Resets background colors, toggles background color for the selected priority, and adds the priority value.
 *
 * @param {string} priorityType - The type of priority clicked.
 * @returns {void}
 */
function handlePriorityClick(priorityType) {
  resetBackgroundColors();
  toggleBackgroundColor(priorityType);
  addPriorityValue(priorityType);
}

/**
 * Resets the background colors of all priority buttons.
 *
 * @returns {void}
 */
function resetBackgroundColors() {
  const buttons = document.querySelectorAll(".priorityBox > div");
  buttons.forEach((button) => {
    button.classList.remove("activePrioLow");
    button.classList.remove("activePrioMedium");
    button.classList.remove("activePrioUrgent");
  });
}

/**
 * Toggles the background color of buttons based on the priority type.
 * If the button has the specified priority type, it adds an active class for that priority type.
 * Otherwise, it removes active classes for all priority types.
 *
 * @param {string} priorityType - The priority type ('low', 'medium', or 'urgent').
 * @returns {void}
 */
function toggleBackgroundColor(priorityType) {
  const buttons = document.querySelectorAll(".priorityBox > div");
  buttons.forEach((button) => {
    if (button.classList.contains(priorityType)) {
      button.classList.add(
        "activePrio" +
          priorityType.charAt(0).toUpperCase() +
          priorityType.slice(1)
      );
    } else {
      button.classList.remove("activePrioLow");
      button.classList.remove("activePrioMedium");
      button.classList.remove("activePrioUrgent");
    }
  });
}

/**
 * Sets the current priority value and displays corresponding icons based on the selected priority.
 *
 * @param {string} priority - The priority value to be set.
 * @returns {void}
 */
function addPriorityValue(priority) {
  currentPriority = priority;
  console.log("Selected priority:", currentPriority);
  showIconsPrio(priority);
}

/**
 * Toggles the checkbox checked state based on the provided index.
 *
 * @param {number} i - The index of the checkbox to toggle.
 * @returns {void}
 */
function checkCheckbox(i) {
  var checkbox = document.getElementById(`checkboxMember${i}`);
  checkbox.checked = !checkbox.checked;
}

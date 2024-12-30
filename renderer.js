// const { ipcRenderer } = require("electron");

const editor = document.getElementById("editor");
const formatOptions = document.getElementById("formatOptions");
const dropdown = document.getElementById("dropdown");
const dropdownButton = document.getElementById("dropdownButton");
const headingButtons = dropdown.querySelectorAll("button");
const boldButton = document.getElementById("bold");
const italicButton = document.getElementById("italic");
const toolbar = document.getElementById("toolbar");
const imageFileInput = document.getElementById("imageFileInput");
const underlineButton = document.getElementById("underline");
const themeToggle = document.getElementById("themeToggle");
const nameModal = document.getElementById("nameModal");
const submitNameButton = document.getElementById("submitName");
const usernameInput = document.getElementById("usernameInput");
const greeting = document.getElementById("greeting");

let username = "";

// Handle theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "🌞"
    : "🌙";
});

// Handle modal and user name input
submitNameButton.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (username) {
    nameModal.style.display = "none";
    updateGreeting();
  }
});

// Show greeting based on time of day
function updateGreeting() {
  const hour = new Date().getHours();
  const greetingText = hour < 12 ? "Good Morning" : "Good Evening";
  greeting.textContent = `${greetingText}, ${username}! Time to Journal for today! :D`;
}

// Position and show format options
editor.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    formatOptions.style.display = "flex";
    formatOptions.style.flexDirection = "row";
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();
    formatOptions.style.top = `${rect.top - formatOptions.offsetHeight + 50}px`;
    formatOptions.style.left = `${rect.left + rect.width / 2 - 200}px`;
    dropdown.style.top = `${rect.top - dropdown.offsetHeight + 50}px`;
    dropdown.style.left = `${rect.left + rect.width / 2 - 200}px`;
  } else {
    formatOptions.style.display = "none";
  }
});

// Handle dropdown button click
dropdownButton.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

// Close dropdown on click outside
document.addEventListener("click", (event) => {
  if (!formatOptions.contains(event.target) && event.target !== editor) {
    formatOptions.style.display = "none";
  }
  if (!dropdown.contains(event.target) && event.target !== dropdownButton) {
    dropdown.style.display = "none";
  }
});

// Apply heading style
headingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedText = window.getSelection();
    if (selectedText.rangeCount > 0) {
      const range = selectedText.getRangeAt(0);
      const wrapper = document.createElement(button.id);
      range.surroundContents(wrapper);
    }
    dropdown.style.display = "none";
  });
});

// Apply bold, italic, and underline
boldButton.addEventListener("click", () => {
  document.execCommand("bold");
});
italicButton.addEventListener("click", () => {
  document.execCommand("italic");
});
underlineButton.addEventListener("click", () => {
  document.execCommand("underline");
});

// Save Button
document.getElementById("saveBtn").addEventListener("click", () => {
  const content = editor.innerHTML; // Get the editor content

  // Send the content to the main process to be saved
  window.electron
    .saveJournal(content)
    .then((response) => {
      alert(response); // Show success message
    })
    .catch((err) => {
      console.error("Error saving content:", err);
    });
});

// Name Submission
document.getElementById("submitName").addEventListener("click", () => {
  const username = document.getElementById("usernameInput").value;
  if (username) {
    localStorage.setItem("username", username); // Save username to local storage
    document.getElementById("nameModal").style.display = "none"; // Hide the modal
    updateGreeting(username); // Update the greeting message
  }
});

// Function to update greeting
function updateGreeting(username) {
  const greetingElement = document.getElementById("greeting");
  const hours = new Date().getHours();
  const greeting =
    hours < 12
      ? `Good Morning, ${username}! Time to Journal for today! :D`
      : `Good Evening, ${username}! Time to Journal for today! :D`;
  greetingElement.textContent = greeting;
}

// Theme Toggle (Day/Night Mode)
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.getElementById("themeToggle").classList.toggle("fa-sun");
  document.getElementById("themeToggle").classList.toggle("fa-moon");
});
document
  .getElementById("imageFileInput")
  .addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = `<img src="${e.target.result}" alt="Image" style="width:200px; height:200px; margin-top:10px; border:2px solid gray; border-radius:6px;" />`;
        editor.innerHTML += img; // Add the image to the editor content
        editor.focus();
      };
      reader.readAsDataURL(file); // Convert file to Base64 string
    }
  });

// Handle Drag and Drop Image Upload
editor.addEventListener("dragover", (e) => {
  e.preventDefault();
});

editor.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = `<img src="${e.target.result}" alt="Image" style="width:100%; height:auto; margin-top:10px;" />`;
      editor.innerHTML += img; // Add the image to the editor content
      editor.focus();
    };
    reader.readAsDataURL(file); // Convert file to Base64 string
  }
});

// Save Button Logic

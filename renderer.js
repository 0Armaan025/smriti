const editor = document.getElementById("editor");
const formatOptions = document.getElementById("formatOptions");
const dropdown = document.getElementById("dropdown");
const dropdownButton = document.getElementById("dropdownButton");
const headingButtons = dropdown.querySelectorAll("button");
const boldButton = document.getElementById("bold");
const italicButton = document.getElementById("italic");
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

// Show the name modal on app lo

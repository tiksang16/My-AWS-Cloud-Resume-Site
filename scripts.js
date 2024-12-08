// Select the theme toggle button
const themeToggle = document.getElementById("theme-toggle");

// Add an event listener for clicks on the toggle button
themeToggle.addEventListener("click", () => {
  // Check if the body currently has the "dark" class
  if (document.body.classList.contains("dark")) {
    // Switch to light mode
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    themeToggle.textContent = "🌙"; // Moon icon for dark mode
  } else {
    // Switch to dark mode
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️"; // Sun icon for light mode
  }
});

// Set default mode to light if no theme is set
document.body.classList.add("light");
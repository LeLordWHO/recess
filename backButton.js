document.addEventListener("DOMContentLoaded", function() {
    const backButtonHTML = `
      <a href="index.html">
        Back
      </a>
    `;
  
    const backButtonContainer = document.createElement("div");
    backButtonContainer.className = "back-button-container"; // Add the CSS class to your div
    backButtonContainer.innerHTML = backButtonHTML;
    document.body.prepend(backButtonContainer); // prepend will place the button at the top of the body
  });
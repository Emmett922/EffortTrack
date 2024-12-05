document.addEventListener("DOMContentLoaded", () => {
  const risksContainer = document.getElementById("risks-container");
  const requirementsContainer = document.getElementById(
    "requirements-container"
  );
  const teamContainer = document.getElementById("team-container");

  document.getElementById("addRisk").addEventListener("click", () => {
    const riskDiv = document.createElement("div");
    riskDiv.classList.add("risk-input");
    riskDiv.innerHTML = `
            <input type="text" placeholder="Risk description" class="risk-description">
            <select class="risk-priority">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>`;
    risksContainer.appendChild(riskDiv);
    sortRisks();
  });

  document.getElementById("removeRisk").addEventListener("click", () => {
    if (risksContainer.children.length > 1) {
      risksContainer.removeChild(risksContainer.lastElementChild);
    } else {
      risksContainer.querySelector(".risk-description").value = "";
    }
  });

  document.getElementById("addRequirement").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("requirement");
    input.placeholder = "Requirement";
    requirementsContainer.appendChild(input);
  });

  document.getElementById("removeRequirement").addEventListener("click", () => {
    if (requirementsContainer.children.length > 1) {
      requirementsContainer.removeChild(requirementsContainer.lastElementChild);
    } else {
      requirementsContainer.querySelector("input").value = "";
    }
  });

  document.getElementById("addTeamMember").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("team-member");
    input.placeholder = "Team Member";
    teamContainer.appendChild(input);
  });

  document.getElementById("removeTeamMember").addEventListener("click", () => {
    if (teamContainer.children.length > 1) {
      teamContainer.removeChild(teamContainer.lastElementChild);
    } else {
      teamContainer.querySelector("input").value = "";
    }
  });

  function getCurrentUserId(username) {
    fetch(
      "https://oh7tijl74zopgt4in53juml46q0lmejj.lambda-url.us-east-2.on.aws/?username=" +
        encodeURIComponent(username),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("User not found or error retrieving data");
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the user data contains an `id` field
        const userId = data.userId; // Adjust this based on the response structure from the backend
        console.log("User ID: ", userId);
        // You can now use the userId as needed
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  document
    .getElementById("projectForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission

      // Get form data
      const projectTitle = document.getElementById("projectTitle").value;
      const projectDescription =
        document.getElementById("projectDescription").value;

      const userId = getCurrentUserId();

      // Get Risks
      const risks = [];
      document.querySelectorAll(".risk-input").forEach((riskInput) => {
        const riskDescription =
          riskInput.querySelector(".risk-description").value;
        const riskPriority = riskInput.querySelector(".risk-priority").value;
        risks.push({ description: riskDescription, priority: riskPriority });
      });

      // Get Requirements
      const requirements = [];
      document.querySelectorAll(".requirement").forEach((input) => {
        requirements.push(input.value);
      });

      // Get Team Members
      const teamMembers = [];
      document.querySelectorAll(".team-member").forEach((input) => {
        teamMembers.push(input.value);
      });

      // Get File (if any)
      const fileInput = document.getElementById("fileToUpload");
      let fileBase64 = null;
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        // Convert file to base64
        const reader = new FileReader();
        reader.onloadend = function () {
          fileBase64 = reader.result.split(",")[1]; // Get only the base64 string (without "data:image/png;base64,")
          submitProject(fileBase64); // Submit project with file
        };
        reader.readAsDataURL(file);
      } else {
        submitProject(); // Submit project without file
      }

      // Submit the project data to the Lambda backend
      function submitProject(fileBase64 = null) {
        const projectData = {
          projectTitle,
          projectDescription,
          userId,
          risks,
          requirements,
          teamMembers,
          file: fileBase64, // Include the base64-encoded file or null
        };

        fetch(
          "https://oh7tijl74zopgt4in53juml46q0lmejj.lambda-url.us-east-2.on.aws/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(projectData),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            alert("Project submitted successfully!");
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Error submitting project.");
          });
      }
    });

  document.getElementById("cancelButton").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Handle login form submission
  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission

    // Get user credentials
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check if username and password are provided
    if (!username || !password) {
      alert("Please provide both username and password.");
      return;
    }

    // Attempt to login
    loginUser(username, password);
  });

  // Handle user registration (new user creation)
  document
    .getElementById("registerForm")
    .addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent form submission

      const username = document.getElementById("newUsername").value;
      const password = document.getElementById("newPassword").value;

      if (!username || !password) {
        alert("Please provide both username and password.");
        return;
      }

      // Attempt to register the user
      registerUser(username, password);
    });

  function sortRisks() {
    const risks = Array.from(risksContainer.querySelectorAll(".risk-input"));
    risks.sort((a, b) => {
      const priorityA = a.querySelector(".risk-priority").value;
      const priorityB = b.querySelector(".risk-priority").value;

      const priorityRank = { High: 1, Medium: 2, Low: 3 };
      return priorityRank[priorityA] - priorityRank[priorityB];
    });

    risks.forEach((risk) => risksContainer.appendChild(risk));
  }

  // Handle user login request
  function loginUser(username, encryptedPassword) {
    fetch(
      "https://oh7tijl74zopgt4in53juml46q0lmejj.lambda-url.us-east-2.on.aws/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          username,
          password: encryptedPassword,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("username", username);
          // Redirect to home page after successful login
          window.location.href = "home.html";
        } else {
          alert("Login failed: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error logging in.");
      });
  }

  function registerUser(username, encryptedPassword) {
    fetch(
      "https://oh7tijl74zopgt4in53juml46q0lmejj.lambda-url.us-east-2.on.aws/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "register",
          username: username,
          password: encryptedPassword,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("User registered successfully!");
          window.location.href = "index.html"; // Redirect to login page
        } else {
          alert("Registration failed: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error registering user.");
      });
  }

  risksContainer.addEventListener("change", (event) => {
    if (event.target.classList.contains("risk-priority")) {
      sortRisks();
    }
  });
});

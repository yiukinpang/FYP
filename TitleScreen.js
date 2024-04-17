class TitleScreen {
  constructor({ progress }) {
    this.progress = progress;
    this.loginForm = null;
    this.createUserForm = null;
  }

  
  getOptions(resolve) {
    const safeFile = this.progress.getSaveFile();
    const loginOption = {
      label: "Login",
      description: "Login to continue",
      handler: () => {
        this.showLoginScreen(resolve);
      }
    };

    const createUserOption = {
      label: "Create User",
      description: "Create a new user account",
      handler: () => {
        this.showCreateUserScreen(resolve);
      }
    };

    return [
      {
        label: "New Game",
        description: "Start a new pizza adventure.",
        handler: () => {
          this.close();
          resolve();
        }
      },
      safeFile
        ? {
          label: "Continue Game",
          description: "Resume your adventure",
          handler: () => {
            this.close();
            resolve(safeFile);
          }
        }
        : null,
      loginOption,
      createUserOption
    ].filter(v => v);
  }

  showLoginScreen(resolve) {
    if (this.createUserForm) {
      this.element.removeChild(this.createUserForm);
      this.createUserForm = null;
    }

    if (!this.loginForm) {
      this.loginForm = document.createElement("div");
      this.loginForm.innerHTML = `
        <input type="text" id="username" placeholder="Username">
        <input type="password" id="password" placeholder="Password">
        <button id="login-button">Login</button>
      `;

      const loginButton = this.loginForm.querySelector("#login-button");
      loginButton.addEventListener("click", () => {
        const username = this.loginForm.querySelector("#username").value;
        const password = this.loginForm.querySelector("#password").value;

        this.login(username, password, resolve);
      });
    }

    this.element.appendChild(this.loginForm);
  }

  login = (username, password, resolve) => {
    const data = {
      username: username,
      password: password
    };

    fetch("https://us-central1-fyp-a08.cloudfunctions.net/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          this.element.removeChild(this.loginForm);
          this.close();
          resolve();
          console.log("Login success!");
        } else {
          alert("login failed.");  
          console.log("Login failed.");
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
  };

  showCreateUserScreen(resolve) {
    if (this.loginForm) {
      this.element.removeChild(this.loginForm);
      this.loginForm = null;
    }

    if (!this.createUserForm) {
      this.createUserForm = document.createElement("div");
      this.createUserForm.innerHTML = `
        <input type="text" id="new-username" placeholder="Username">
        <input type="password" id="new-password" placeholder="Password">
        <input type="email" id="new-email" placeholder="Email">
        <button id="create-user-button">Create User</button>
      `;

      const createUserButton = this.createUserForm.querySelector(
        "#create-user-button"
      );
      createUserButton.addEventListener("click", () => {
        const newUsername = this.createUserForm.querySelector("#new-username").value;
        const newPassword = this.createUserForm.querySelector("#new-password").value;
        const newEmail = this.createUserForm.querySelector("#new-email").value;

        this.createUser(newUsername, newPassword, newEmail, resolve);
      });
    }

    this.element.appendChild(this.createUserForm);
  }

  createUser = (username, password, email, resolve) => {
    const data = {
      username: username,
      password: password,
      email: email
    };


    fetch("https://us-central1-fyp-a08.cloudfunctions.net/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        console.log("Response status:", response.status);
        if (response.ok) {
          this.element.removeChild(this.createUserForm);
          this.close();
          resolve();
          alert("User created successfully!")
          console.log("User created successfully!");
        } else {
          alert("Failed to create user.")
          console.log("Failed to create user.");
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
  };

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = `
      <img class="TitleScreen_logo" src="images/logo.png" alt="Pizza Legends" />
    `;
  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }

  init(container) {
    return new Promise(resolve => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve));
    });
  }
}
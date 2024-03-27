class TitleScreen {
  constructor({ progress }) {
    this.progress = progress;
    this.loginForm = null;
    this.teacherLoginForm=null;
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

    const teacherLoginOption = {
      label: "Teacher Login",
      description: "Login as a teacher",
      handler: () => {
        this.showTeacherLoginScreen(resolve);
      }
    };
  

    
    

    const createUserOption = {
      label: "Create User",
      description: "Create a new user account",
      handler: () => {
        this.showCreateUserScreen(resolve);
      }
    };

    const rememberMeOption = {
  label: "Remember Me",
  description: "Stay logged in even after closing the browser",
  handler: () => {
    // 在这里添加保存登录状态的逻辑
    // ...
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
      teacherLoginOption,
      createUserOption
    ].filter(v => v);
  }

  showLoginScreen(resolve) {
    if (this.createUserForm) {
      this.element.removeChild(this.createUserForm);
      this.createUserForm = null;
    }

    if (this.teacherLoginForm) {
      this.element.removeChild(this.teacherLoginForm);
      this.teacherLoginForm = null;
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
          console.log("Login failed.");
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
  };

  showTeacherLoginScreen(resolve) {
    if (this.createUserForm) {
        this.element.removeChild(this.createUserForm);
        this.createUserForm = null;
    }

    if (this.loginForm) {
        this.element.removeChild(this.loginForm);
        this.loginForm = null;
    }

    if (!this.teacherLoginForm) {
        this.teacherLoginForm = document.createElement("div");
        this.teacherLoginForm.innerHTML = `
            <input type="text" id="username" placeholder="Username">
            <input type="password" id="password" placeholder="Password">
            <button id="teacher-login-button">Teacher Login</button>
        `;

        const teacherLoginButton = this.teacherLoginForm.querySelector("#teacher-login-button");
        teacherLoginButton.addEventListener("click", () => {
            const username = this.teacherLoginForm.querySelector("#username").value;
            const password = this.teacherLoginForm.querySelector("#password").value;

            this.teacherLogin(username, password, resolve);
        });
    }

    this.element.appendChild(this.teacherLoginForm);
}

teacherLogin = (username, password, resolve) => {
    const data = {
        username: username,
        password: password
    };

    fetch("https://us-central1-fyp-a08.cloudfunctions.net/teacher_login", {
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
            console.log("Teacher login success!");
        } else {
            console.log("Teacher login failed.");
            alert("Teacher login failed."); // 添加警示框显示登录失败信息
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

    if (this.teacherLoginForm) {
      this.element.removeChild(this.teacherLoginForm);
      this.teacherLoginForm = null;
    }
    if (this.teacherLoginForm) {
      this.element.removeChild(this.teacherLoginForm);
      this.teacherLoginForm = null;
      window.location.href = "";
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
      email: email,
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
          console.log("User created successfully!");
        } else {
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

setCookie("username", "aaaa", 365); 
setCookie("language", "en", 365); 


javascript
Copy
const username = getCookie("username"); 
const language = getCookie("language"); 


javascript
Copy
deleteCookie("username"); 
deleteCookie("language"); 
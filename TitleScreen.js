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

    const teacherLoginOption = {
      label: "Teacher Login",
      description: "Login as a teacher",
      handler: () => {
        this.showTeacherLoginScreen(resolve);
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

  showTeacherLoginScreen(resolve) {
    if (this.loginForm) {
      this.element.removeChild(this.loginForm);
      this.loginForm = null;
    }

    if (!this.createUserForm) {
      this.createUserForm = document.createElement("div");
      this.createUserForm.innerHTML = `
        <input type="text" id="teacher-username" placeholder="Username">
        <input type="password" id="teacher-password" placeholder="Password">
        <button id="teacher-login-button">Login</button>
      `;

      const teacherLoginButton = this.createUserForm.querySelector(
        "#teacher-login-button"
      );
      teacherLoginButton.addEventListener("click", () => {
        const teacherUsername = this.createUserForm.querySelector("#teacher-username").value;
        const teacherPassword = this.createUserForm.querySelector("#teacher-password").value;

        this.teacherLogin(teacherUsername, teacherPassword, resolve);
      });
    }

    this.element.appendChild(this.createUserForm);
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
          this.element.removeChild(this.createUserForm);
          this.close();
          resolve();
          console.log("Teacher login success!");
        } else {
          console.log("Teacher login failed.");
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

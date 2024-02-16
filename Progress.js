class Progress {
  constructor() {
    this.mapId = "Kitchen";
    this.startingHeroX = 0;
    this.startingHeroY = 0;
    this.startingHeroDirection = "down";
    this.saveFileKey = "PizzaLegends_SaveFile1";
  }

  getCookie(tabs) {
    let getting = browser.cookies.get({
      url: tabs[0].url,
      name: "username",
    });
    getting.then(logCookie);
  }

  checkCookie() {
    let username = getCookie("username");
    if (username != "") {
      console.log("Hi," + username);
    } else {
      console.log("no cookies.")
    }
  }


  save() {
    this.checkCookie();
    window.localStorage.setItem(this.saveFileKey, JSON.stringify({
      mapId: this.mapId,
      startingHeroX: this.startingHeroX,
      startingHeroY: this.startingHeroY,
      startingHeroDirection: this.startingHeroDirection,
      playerState: {
        pizzas: playerState.pizzas,
        lineup: playerState.lineup,
        items: playerState.items,
        storyFlags: playerState.storyFlags
      }
    }));

    const data = {
      mapId: this.mapId,
      startingHeroX: this.startingHeroX,
      startingHeroY: this.startingHeroY,
      startingHeroDirection: this.startingHeroDirection,
      playerState: {
        pizzas: playerState.pizzas,
        lineup: playerState.lineup,
        items: playerState.items,
        storyFlags: playerState.storyFlags,
        username: username
      }
    };

    fetch("https://us-central1-fyp-a08.cloudfunctions.net/saveprogress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          console.log("save ok")
        } else {
          console.log("save Nok")
        }
      })
  }

  getSaveFile() {

    if (!window.localStorage) {
      return null;
    }

    const file = window.localStorage.getItem(this.saveFileKey);
    return file ? JSON.parse(file) : null
  }

  load() {
    const file = this.getSaveFile();
    if (file) {
      this.mapId = file.mapId;
      this.startingHeroX = file.startingHeroX;
      this.startingHeroY = file.startingHeroY;
      this.startingHeroDirection = file.startingHeroDirection;
      Object.keys(file.playerState).forEach(key => {
        playerState[key] = file.playerState[key];
      })
    }
  }

}

function logCookie(cookie) {
  if (cookie) {
    console.log(cookie.value);
  }
}

function getCookie(tabs) {
  let getting = browser.cookies.get({
    url: tabs[0].url,
    name: "favorite-color",
  });
  getting.then(logCookie);
}

let getActive = browser.tabs.query({
  active: true,
  currentWindow: true,
});
getActive.then(getCookie);
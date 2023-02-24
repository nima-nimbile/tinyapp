const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser") 
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //parse form data
app.use(cookieParser());
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use((req, res, next) => {
  res.locals.req = req;
  next();
});

function generateRandomString() {
  let newString = '';
  const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let x = 0; x < 6; x += 1) {
    newString += charList.charAt(Math.floor(Math.random() * charList.length));
  }
  return newString;
};

const users = {
  userID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  userID: {
    id: "userRandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
app.post("/register", (req, res) => {
  const newUserID = generateRandomString();
  const subEmail = req.body.email;
  const subPassword = req.body.password;
  users[newUserID] = {
    id: newUserID,
    email: subEmail,
    password: subPassword
  }
  res.cookie("user_id", users[newUserID]);
  res.redirect("/urls")
})
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    // username: req.cookies["username"],
    user_id: req.cookies["user_id"],
    user: users
  };
  res.render("urls_register", templateVars);
})
app.post("/urls/:id/delete", (req, res) => {
  let shortUrl = req.params.id;
  delete urlDatabase[shortUrl];
  res.redirect("/urls")
})

app.post("/urls", (req, res) => {
  const newInfo = req.body; // Log the POST request body to the console
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = newInfo.longURL;
  res.redirect(`/urls/${shortUrl}`);

});
app.get("/u/:id", (req, res) => {
  let shortUrl = req.params.id;
  const longURL = urlDatabase[shortUrl];

  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  // res.render("urls_new");
  const templateVars = {
    urls: urlDatabase,
    // username: req.cookies["username"],
    user_id: req.cookies["user_id"],
    user: users
  };
  res.render("urls_new", templateVars);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get('/urls', (req, res) => {
  console.log(req.cookies["username"])
  const templateVars = {
    urls: urlDatabase,
    // username: req.cookies["username"]
    user_id: req.cookies["user_id"],
    user: users
  };
  res.render('urls_index', templateVars);
});
app.post("/urls/:id", (req, res) => {
  let newLongUrl = req.body.nim;
  console.log("new URL: ", newLongUrl);
  let shortUrl = req.params.id;
  console.log("Id", shortUrl)
  urlDatabase[shortUrl] = newLongUrl;
  res.redirect("/urls")

})

app.get("/urls/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    // username: req.cookies["username"],
    user_id: req.cookies["user_id"],
    user: users
  };
  res.render("urls_login", templateVars);
})

app.get("/urls/logout", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    // username: req.cookies["username"],
    user_id: req.cookies["user_id"],
    user: users
  };
  res.render("urls", templateVars);
})
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls")
})

app.post("/login", (req, res) => {
  const userId = req.body.username;
  console.log("---------------------",userId)
  res.cookie("username", userId);
  res.redirect("/urls")
})

app.get("/", (req, res) => {

  res.send("Hello!");
});
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id, longURL: req.params.longURL,
    // username: req.cookies["username"],
    user_id: req.cookies["user_id"],
    user: users
  };
  res.render("urls_show", templateVars);
});
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
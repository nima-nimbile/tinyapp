const { generateRandomString, emailChecker, passChecker, urlsForUser, urlDatabase, users } = require("./helpers");
const cookieSession = require('cookie-session');
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //parse form data
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use((req, res, next) => {
  res.locals.req = req;
  next();
});

// .........................................................."/register"
app.post("/register", (req, res) => {
  const newUserID = generateRandomString();
  const subEmail = req.body.email;
  const subPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(subPassword, 10);
  if (!subEmail || !subPassword) {
    res.status(400).send("Please provide valid email and password");
  }
  if (emailChecker(subEmail, users)) {
    res.status(400).send("this email has already taken");
  } else {
    users[newUserID] = {
      id: newUserID,
      email: subEmail,
      password: hashedPassword
    };
    req.session.user_id = users[newUserID];
    res.redirect("/urls");
  }
});
app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      urls: urlDatabase,
      user_id: req.session.user_id,
      user: users
    };
    res.render("urls_register", templateVars);
  }
});
// .........................................................."/urls/:id/delete"
app.post("/urls/:id/delete", (req, res) => {
  let shortUrl = req.params.id;
  if (!urlsForUser(shortUrl, req.session.user_id)) {
    res.send("you do not own the URL");
  } else {
    delete urlDatabase[shortUrl];
    res.redirect("/urls");
  }
});

// .........................................................."/u/:id"
app.get("/u/:id", (req, res) => {

  let shortUrl = req.params.id;
  if (!urlDatabase[shortUrl]) {
    res.send("URL does not exist");
  } else {
    const longURL = urlDatabase[shortUrl].longURL;

    res.redirect(longURL);
  }
});
// .........................................................."/urls/new"
app.get("/urls/new", (req, res) => {
  // res.render("urls_new");
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    const templateVars = {
      urls: urlDatabase,
      user_id: req.session.user_id,
      user: users
    };
    res.render("urls_new", templateVars);
  }
});
// .........................................................."/hello"
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
// .........................................................."/urls.json"
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// ..........................................................'/urls'
app.get('/urls', (req, res) => {
  if (!req.session.user_id) {
    res.send(`Please first <a href="/login">login</a> or <a href="/register">register</a>`);
  } else {
    const templateVars = {
      urls: urlDatabase,
      user_id: req.session.user_id,
      user: users
    };
    res.render('urls_index', templateVars);
  }
});

app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.send("<h5>You have to first login</h5>\n");
  } else {
    const newInfo = req.body;
    let shortUrl = generateRandomString();
    urlDatabase[shortUrl] = { longURL: newInfo.longURL, userID: req.session.user_id.id },
    res.redirect(`/urls/${shortUrl}`);
  }
});

// .........................................................."/login"
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      urls: urlDatabase,
      user_id: req.session.user_id,
      user: users
    };
    res.render("urls_login", templateVars);
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let userId = emailChecker(email, users);
  if (!userId) {
    res.status(403).send("Please provide valid email");
  } else if (!passChecker(password, userId)) {
    res.status(403).send("Password is not match");
  } else {
    req.session.user_id = users[userId];
    res.redirect("/urls");
  }

});
// ..........................................................logout
app.get("/urls/logout", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user_id: req.session.user_id,
    user: users
  };
  res.render("urls", templateVars);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});
// .........................................................."/"

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});
// .........................................................."/urls/:id"
app.get("/urls/:id", (req, res) => {
  let shortUrl = req.params.id;
  if (!urlsForUser(shortUrl, req.session.user_id)) {
    res.send("you do not own the URL");
  } else {
    const templateVars = {
      id: shortUrl, 
      longURL: urlDatabase[shortUrl]["longURL"],
      user_id: req.session.user_id,
      user: users
    };
    res.render("urls_show", templateVars);
  }
});
app.post("/urls/:id", (req, res) => {
  let shortUrl = req.params.id;
  if (!urlsForUser(shortUrl, req.session.user_id)) {
    res.send("you do not own the URL");
  } else {
    let newLongUrl = req.body.nim;
    urlDatabase[shortUrl]["longURL"] = newLongUrl;
    res.redirect("/urls");
  }
});
// .........................................................."/set"
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});
// .........................................................."/fetch"

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});
// ..........................................................PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
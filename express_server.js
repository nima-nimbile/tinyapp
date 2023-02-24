const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser") 
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //parse form data
app.use(cookieParser());


app.use((req, res, next) => {
  res.locals.req = req;
  next();
});
// ..........................................................urlDatabase Object
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// ..........................................................generateRandomString()
function generateRandomString() {
  let newString = '';
  const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let x = 0; x < 6; x += 1) {
    newString += charList.charAt(Math.floor(Math.random() * charList.length));
  }
  return newString;
};
// ..........................................................emailChecker(emailCheck)
function emailChecker(emailCheck) {
  for (let key in users) {
    if (users[key]['email'] === emailCheck.trim()) {
      return key;
    }
  }
};
// ..........................................................passChecker(pass)
function passChecker(pass, userId) {
  let samePass = false;
  if (users[userId]['password'] === pass.trim()) {
    samePass = true;
  }
  return samePass;
};
// ..........................................................users Object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "nima@hotmail.com",
    password: "123",
  },
};
// .........................................................."/register"
app.post("/register", (req, res) => {
  const newUserID = generateRandomString();
  const subEmail = req.body.email;
  const subPassword = req.body.password;
  if (!subEmail || !subPassword) {
    res.status(400).send("Please provide valid email and password");
  }
  if (emailChecker(subEmail)) {
    res.status(400).send("this email has already taken");
  }
  users[newUserID] = {
    id: newUserID,
    email: subEmail,
    password: subPassword
  }
  
  res.cookie("user_id", users[newUserID]);
  res.redirect("/urls")
})
app.get("/register", (req, res) => {
  if (req.cookies["user_id"]){
    res.redirect("/urls");
  }else{
  const templateVars = {
    urls: urlDatabase,
    // username: req.cookies["username"],
    user_id: req.cookies["user_id"],
    user: users
  };
  res.render("urls_register", templateVars);
}
});
// .........................................................."/urls/:id/delete"
app.post("/urls/:id/delete", (req, res) => {
  let shortUrl = req.params.id;
  delete urlDatabase[shortUrl];
  res.redirect("/urls")
});

// .........................................................."/u/:id"
app.get("/u/:id", (req, res) => {
  
  let shortUrl = req.params.id;
  if (!urlDatabase[shortUrl]){
    res.send("URL does not exist");
  } else {
  const longURL = urlDatabase[shortUrl];
  console.log("longURL: ", longURL)

  res.redirect(longURL);
  }
});
// .........................................................."/urls/new"
app.get("/urls/new", (req, res) => {
  // res.render("urls_new");
  if (!req.cookies["user_id"]){
    res.redirect("/login");
  } else {
  const templateVars = {
    urls: urlDatabase,
    // username: req.cookies["username"],
    user_id: req.cookies["user_id"],
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
  // console.log(req.cookies["username"])
  const templateVars = {
    urls: urlDatabase,
    // username: req.cookies["username"]
    user_id: req.cookies["user_id"],
    user: users
  };
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  if (!req.cookies["user_id"]){
    res.send("<h5>You have to first login</h5>\n");
  } else {
  const newInfo = req.body; // Log the POST request body to the console
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = newInfo.longURL;
  res.redirect(`/urls/${shortUrl}`);
  }
});

// .........................................................."/login"
app.get("/login", (req, res) => {
  if (req.cookies["user_id"]){
    res.redirect("/urls");
  } else {
  const templateVars = {
    urls: urlDatabase,
    // username: req.cookies["username"],
    user_id: req.cookies["user_id"],
    user: users
  };
  res.render("urls_login", templateVars);
}
})

app.post("/login", (req, res) => {
  const newUserID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  let userId = emailChecker(email);
  if (!userId) {
    res.status(403).send("Please provide valid email");
  }
  else if (!passChecker(password, userId)) {
    res.status(403).send("Password is not match");
  } else{
    
  res.cookie("user_id", users[userId]);
  res.redirect("/urls")
  }
  
})
// ..........................................................logout
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
  res.redirect("/login")
})

// .........................................................."/"

app.get("/", (req, res) => {

  res.send("Hello!");
});
// .........................................................."/urls/:id"
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id, longURL: req.params.longURL,
    // username: req.cookies["username"],
    user_id: req.cookies["user_id"],
    user: users
  };
  res.render("urls_show", templateVars);
});
app.post("/urls/:id", (req, res) => {
  let newLongUrl = req.body.nim;
  // console.log("new URL: ", newLongUrl);
  let shortUrl = req.params.id;
  // console.log("Id", shortUrl)
  urlDatabase[shortUrl] = newLongUrl;
  res.redirect("/urls")

})
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
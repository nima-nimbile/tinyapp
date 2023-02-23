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
}

app.post("/urls/:id/delete", (req, res) => {
  let shortUrl = req.params.id;
  delete urlDatabase[shortUrl];
  res.redirect("/urls")
})
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.username
  };
  res.render('urls_index', templateVars);
});

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
app.get("/urls/login", (req, res) => {
  res.render("urls_login");
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_index", templateVars);
})
app.get("/urls/new", (req, res) => {
  // res.render("urls_new");
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_new", templateVars);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls/:id", (req, res) => {
  let newLongUrl = req.body.nim;
  console.log("new URL: ", newLongUrl);
  let shortUrl = req.params.id;
  console.log("Id", shortUrl)
  urlDatabase[shortUrl] = newLongUrl;
  res.redirect("/urls")

})

app.post("/login", (req, res) => {
  // const userId = req.body.username;
  res.cookie("username", req.cookies["username"]);
  res.redirect("/urls")
})

app.get("/", (req, res) => {

  res.send("Hello!");
});
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id, longURL: req.params.longURL,
    username: req.cookies["username"],
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
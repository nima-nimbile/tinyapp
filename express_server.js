const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //parse form data

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
 
function generateRandomString() {
  let newString = '';
  const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let x = 0; x < 6; x += 1) {
    newString += charList.charAt(Math.floor(Math.random() * charList.length));
  }
  return newString;
}
app.post("/urls", (req, res) => {
  const newInfo = req.body; // Log the POST request body to the console
  console.log(newInfo);
  urlDatabase[generateRandomString()] = newInfo.longURL;
  res.redirect(`/urls/${generateRandomString()}`); 
});
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase.id
  
  res.redirect(longURL);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: req.params.longURL };
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
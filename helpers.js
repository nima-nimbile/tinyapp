const bcrypt = require("bcryptjs");

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  }

};

// ..........................................................users Object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: 'nilou@gmail.com',
    password: '$2a$10$TK8hTjgPXHjPZl70300/Y.LcKNgUpBfvOpu8rDj6gUB/xFELFQyTK'
  },
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
// ..........................................................getUserByEmail(email, database)
const getUserByEmail = function(email, database) {
  // lookup magic...
  for (let key in database){
    if (database[key]["email"] === email.trim()) {
    return key;
    }
  }
};
// ..........................................................emailChecker(emailCheck)
function emailChecker(emailCheck, users) {
  for (let key in users) {
    if (users[key]['email'] === emailCheck.trim()) {
      return key;
    }
  }
};
// ..........................................................passChecker(pass)
function passChecker(pass, userId) {
  let samePass = false;
  if (bcrypt.compareSync(pass.trim(), users[userId]['password'])) {
    samePass = true;
  }
  return samePass;
};
// ..........................................................urlsForUser(id, userDatabase)
const urlsForUser = function(shortURL, user) {
  if(user){
    if (urlDatabase[shortURL].userID === user.id){
      return true
    }
  }
};


module.exports = { generateRandomString, getUserByEmail, emailChecker, passChecker, urlsForUser, urlDatabase, users};
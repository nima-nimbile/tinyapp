const bcrypt = require("bcryptjs");
const {urlDatabase, users} = require("./data");
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
// ..........................................................emailChecker(emailCheck, users)
function emailChecker(emailCheck, users) {
  for (let key in users) {
    if (users[key]['email'] === emailCheck.trim()) {
      return key;
    }
  }
};
// ..........................................................passChecker(pass, userId)
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


module.exports = { generateRandomString, getUserByEmail, emailChecker, passChecker, urlsForUser};
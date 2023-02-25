const { assert } = require('chai');

const {generateRandomString, getUserByEmail} = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    // const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(getUserByEmail("user@example.com", testUsers), expectedUserID);
  });
  it('should return undefined with invalid email', function() {
    // const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "undefined";
    assert.notEqual(getUserByEmail("user@example.com", testUsers), expectedUserID);
  });
});


describe('generateRandomString', function() {

  it('should return a string with six characters', function() {
    const expectedOutput = 6;
    assert.equal(generateRandomString().length, expectedOutput);
  });

  it('should not return the same string when called multiple times', function() {
   
    assert.notEqual(generateRandomString(), generateRandomString());
  });
});


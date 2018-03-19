const express = require('express');
const router = express.Router();
const dbConnection = require('../db/DbConnect'); 
const bcrypt = require('bcrypt');


router.post('/', (req, res, next) => {
  let data = req.body;
  let requiredFields=["firstName","lastName","password","phoneNumber","secretQuestionAnswer"];

  let missingFields = requiredFields.filter(item => {
    if(!data[item]) {
      return true;
    } 
  });

  if (missingFields.length) {
    return  res.json({ success: false, message: `Required fields are missing: ${missingFields.join(', ')}` });
  }
  let passwordHash = bcrypt.hashSync(data['password'], 10);
  let userId = dbConnection.insertInDb(`INSERT INTO User('Name', 'LastName', 'Mobile', 'PasswordHash') VALUES(?, ?, ?, ?)`, [data['firstName'], data['lastName'], data['phoneNumber'], passwordHash]);
  let questionId =  dbConnection.insertInDb(`insert into UserSecretQuestion ('UserId', 'Answer') values (?, ?)`, [userId, data['secretQuestionAnswer']]);
  return res.json({ status : "Success" });
});

module.exports = router;
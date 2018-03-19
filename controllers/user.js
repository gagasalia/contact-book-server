const express = require('express');
const router = express.Router();
const dbConnection = require('../db/DbConnect'); 
const CommonUtils = require('../utils/CommonUtils');



router.post('/addContact', (req, res, next) => {
  let curUserId = CommonUtils.getUserId(req);
  let data = req.body;
  let requiredFields=["firstName","lastName","phoneNumber"];
  let missingFields = requiredFields.filter(item => {
    if(!data[item]) {
      return true;
    } 
  });

  if (missingFields.length) {
    return  res.json({ success: false, message: `Required fields are missing: ${missingFields.join(', ')}` });
  }

  dbConnection.insertInDb(`INSERT INTO Contact('UserId', 'Name', 'LastName', 'Mobile') VALUES(?, ?, ?, ?)`, [curUserId, data['firstName'], data['lastName'], data['phoneNumber']]);
  return res.json({ status : "Success" });
});


router.post('/editContact', (req, res, next) => {
  let curUserId = CommonUtils.getUserId(req);
  let data = req.body;
  console.log("editContact", data['firstName']);
  dbConnection.updateInDb(
    `update Contact set Name = ?, LastName = ?, Mobile = ? where Id = ?`, [data['firstName'], data['lastName'], data['phoneNumber'], data['Id']]);
  return res.json({ status : "Success" });
});


router.post('/removeContact', (req, res, next) => {
  let data = req.body;
  dbConnection.deleteInDb(`delete from Contact where Id = ?`, [data['Id']]);
  return res.json({ status : "Success" });
});

module.exports = router;
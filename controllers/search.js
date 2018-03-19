const express = require('express');
const router = express.Router();
const dbConnection = require('../db/DbConnect'); 
const CommonUtils = require('../utils/CommonUtils');

router.post('/', (req, res, next) => {
  
  let data = req.body;
  let requiredFields=["keyword"];
  console.log(req.decoded);
  let missingFields = requiredFields.filter(item => {
    if(!data[item]) {
      return true;
    } 
  });

  let curUserId = CommonUtils.getUserId(req);
  
  var name = "%"+data['keyword']+"%";
  let searchResults;
  dbConnection.selectInDb(
    `select Id, Name, LastName, Mobile from Contact where UserId = ? and  Name || LastName like ?`, [curUserId, name],  function(data){
   console.log(data);
   searchResults = data;
   return res.json({ status : "Success", searchResult : searchResults });
  });
});

module.exports = router;
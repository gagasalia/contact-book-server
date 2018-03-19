const express = require('express');
const router = express.Router();
const dbConnection = require('../db/DbConnect'); 

router.post('/', (req, res, next) => {
  let data = req.body;
  let requiredFields=["keyword"];

  let missingFields = requiredFields.filter(item => {
    if(!data[item]) {
      return true;
    } 
  });

  if (missingFields.length || data['keyword'].length<3) {
    return  res.json({ success: false, message: `Required field must be at least 3 symbols: keyword` });
  }
  
  var name = "%"+data['keyword']+"%";
  let searchResults;
  dbConnection.selectInDb(
    `select Id, Name, LastName, Mobile from Contact where Name || LastName like ?`, [name],  function(data){
   console.log(data);
   searchResults = data;
   return res.json({ status : "Success", searchResult : searchResults });
  });
});

module.exports = router;
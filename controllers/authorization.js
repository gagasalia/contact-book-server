const express = require('express');
const router = express.Router();
const dbConnection = require('../db/DbConnect');
var jwt = require('jsonwebtoken');
const CommonUtils = require('../utils/CommonUtils');
const bcrypt = require('bcrypt');



router.post('/recover', function (req, res) {
    let data = req.body;
    let requiredFields=["mobile", "answer", "password", "confirmPassword"];
    let missingFields = requiredFields.filter(item => {
        if(!data[item]) {
            return true;    
        } 
    });

    if (missingFields.length) {
        return  res.json({ success: false, message: `Required fields are missing: ${missingFields.join(', ')}` });
    }

    //TODO implement password recovery.
    let mobile = data.mobile;
    let secretQuestionAnswer = data.answer;
    let password = data.password;
    let confirmPassword = data.confirmPassword; 
    //console.log(mobile, secretQuestionAnswer);
    dbConnection.selectInDb('select u.Id from User as u inner join UserSecretQuestion as sq on u.Id = sq.UserId where u.Mobile = ? and sq.Answer = ?', [mobile, secretQuestionAnswer], function(result){
        console.log(result);
        if (result.length){
            var userId = result[0].Id;
            let passwordHash = bcrypt.hashSync(password, 10);
            dbConnection.updateInDb('update User set PasswordHash = ? where Id = ?', [passwordHash, userId]);
            res.json({
                    success: true,
                    message: 'Password updated!',
            });
            return res;
        }else{
            res.json({
                    success: false,
                    message: 'incorrect secret question answer!',
            });
            return res;
        } 
    });
});


router.post('/authenticate', function (req, res) { //this will issue token for valid users  
    var username = req.body.user;
    var password = req.body.password;
    var isUserFound = false;
    var foundUser = {};
    getUserId(username, password, function (result) {
        if (result.length) {
            isUserFound = true;
            foundUser = result[0]
        }
        if (isUserFound) {
            if (bcrypt.compareSync(password, foundUser.PasswordHash)) {
                var secret = new Buffer(CommonUtils.appSecret, 'base64');
                var token = jwt.sign(foundUser, secret, {
                    expiresIn: 60 * 60
                });
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            } else {
                res.json({
                    success: false,
                    message: 'Authentication failed. incorrect password',
                });
            }
            //res.send(foundUser);
        } else {
            res.json({
                success: false,
                message: 'Authentication failed. incorrect MobileNumber',
            });
        }
        return res;
    });
});

function getUserId(mobileNumber, password, callback) {
    dbConnection.selectInDb('select Id, PasswordHash from User where Mobile = ?', [mobileNumber], callback);
}

module.exports = router;

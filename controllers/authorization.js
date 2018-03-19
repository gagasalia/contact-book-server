const express = require('express');
const router = express.Router();
const dbConnection = require('../db/DbConnect');
var jwt = require('jsonwebtoken');
const CommonUtils = require('../utils/CommonUtils');
const bcrypt = require('bcrypt');



router.post('/recover', function (req, res) {
    //TODO implement password recovery.
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

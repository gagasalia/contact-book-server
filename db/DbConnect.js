const sqlite3 = require('sqlite3').verbose();
const CommonUtils = require('../utils/CommonUtils');

function getDb() {
    let db = new sqlite3.Database(CommonUtils.database, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
    return db;
}

function insertInDb(sqlQuery, data) {
    var db = getDb();
    let insertedId = 0;
    db.run(sqlQuery, data, function (err) {
        //, data['secretQuestionAnswer']
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        insertedId = this.lastID;
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
    return insertedId;
}

function updateInDb(sqlQuery, data) {
    var db = getDb();
    let UpdatedId = 0;
    db.run(sqlQuery, data, function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        UpdateId = this.lastID;
        console.log(`A row has been updated!`);
    });
    return 0;
}

function deleteInDb(sqlQuery, data) {
    var db = getDb();
    let removedId = 0;
    db.run(sqlQuery, data, function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been deleted!`);
    });
    return removedId;
}


function selectInDb(sqlQuery, data, callback) {
    var db = getDb();
    db.all(sqlQuery, data, (err, rows) => {
        if (err) {
            throw err;
        }
        return callback(rows);
        // rows.forEach((row) => {
        //     console.log(row.name);
        // });
    });
}


module.exports.getDb = getDb;
module.exports.insertInDb = insertInDb;
module.exports.updateInDb = updateInDb;
module.exports.deleteInDb = deleteInDb;
module.exports.selectInDb = selectInDb;




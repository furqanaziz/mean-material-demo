var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');
var timers = [];

//Openning Database connection
router.use(function (req, res, next) {
  req.db = mysql.createConnection(req.app.locals.dbconfig);
  next();
});

// GET All users listing from database
router.get('/', function (req, res, next) {
  req.db.query('SELECT user_id,name,email,created_at,DATE_ADD(created_at, INTERVAL expire_after MINUTE) expire_at from users order by user_id desc',
          function (err, result) {
            if (err)
              throw err;
            res.send(result);
            console.log("Fetched All User Listing");
          });
  next();
});

// GET Individual user from database
router.get('/:user_id', function (req, res, next) {
  req.db.query('SELECT user_id,name,email,expire_after as expireAfter from users WHERE user_id = ? ', [req.params.user_id],
          function (err, result) {
            if (err)
              throw err;
            res.send(result);
            console.log("Fetched User with ID : " + req.params.user_id);
          });
  next();
});

//Add New User to the database
router.put('/', function (req, res, next) {
  req.body.expireAfter = req.body.expireAfter ? req.body.expireAfter : 0;
  req.body.password = req.body.password ? req.body.password : '';
  req.db.query('INSERT INTO users SET ?', {'name': req.body.name, 'email': req.body.email, 'password': md5(req.body.password), 'expire_after': req.body.expireAfter},
          function (err, result) {
            if (!err) {
              res.send({'success': 'User Updated Successfully!'});
              console.log("New Row Inserted with ID : " + result.insertId);
              scheduleDelete(req, result.insertId);
            }
          });
  next();
});

//Add New User to the database
router.post('/', function (req, res, next) {
  var updatePassword = '';
  if (req.body.password != null && req.body.password != '') {
    updatePassword = ', password = ' + mysql.escape(md5(req.body.password));
  }

  req.body.expireAfter = req.body.expireAfter ? req.body.expireAfter : 0;
  req.db.query('UPDATE users SET name = ? , email = ? , expire_after = ? ' + updatePassword + ' WHERE user_id =  ? ', [req.body.name, req.body.email, req.body.expireAfter, req.body.user_id],
          function (err, result) {
            if (!err) {
              res.send({'success': 'User Updated Successfully!'});
              console.log("Row Updated with ID : " + req.body.user_id);
              scheduleDelete(req, req.body.user_id);
            }
          });
  next();
});

//Add New User to the database
router.delete('/:user_id', function (req, res, next) {
  req.db.query('DELETE FROM users WHERE user_id = ?', [req.params.user_id],
          function (err, result) {
            if (!err) {
              res.send({'success': 'User Deleted Successfully!'});
              console.log("User Deleted with ID : " + req.params.user_id);
            }
          });

  next();
});

//Closing Database connection
router.use(function (req, res, next) {
  req.db.end();
});

var scheduleDelete = function (req, $user_id) {
  req.db = mysql.createConnection(req.app.locals.dbconfig);
  req.db.query('SELECT user_id,TIMESTAMPDIFF(SECOND,NOW(),DATE_ADD(created_at, INTERVAL expire_after MINUTE)) * 1000 as delay FROM `users` WHERE user_id = ?', [$user_id],
          function (err, result) {
            if (!err) {
              clearTimeout(timers[$user_id]);
              timers[$user_id] = setTimeout(function () {
                req.db = mysql.createConnection(req.app.locals.dbconfig);
                req.db.query('DELETE FROM users WHERE user_id = ?', [$user_id],
                        function (err, result) {
                          if (!err)
                            console.log("User Deleted with ID : " + $user_id);
                        });
                req.db.end();
              }, result[0].delay);
              console.log("User Scheduled for deleteion with ID : " + $user_id + " : " + result[0].delay);
            }
          }
  );
  req.db.end();
}

module.exports = router;

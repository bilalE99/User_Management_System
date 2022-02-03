const { urlencoded } = require('body-parser');
const {check, validationResult} = require('express-validator');
const mysql = require('mysql');


//Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});




//View all users
exports.view = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        //console.log('Connection ID ' + connection.threadId)

        //User the connection
        connection.query('SELECT * FROM user', (err, rows) => {

            //When done with connection, release it
            connection.release();

            if (!err) {
                let removedUser = req.query.removed;
                res.render('home', { rows , alert : removedUser});

            } else {
                console.log(err);
            }
            //console.log('Data from user table : \n ', rows)
        });
    });
}


//Search users
exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        //console.log('Connection ID ' + connection.threadId)
        let searchValue = req.body.search;
        //User the connection
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchValue + '%', '%' + searchValue + '%'], (err, rows) => {

            //When done with connection, release it
            connection.release();

            if (!err) {
                res.render('home', { rows });

            } else {
                console.log(err);
            }
            //console.log('Data from user table : \n ', rows)
        });
    });

}

exports.form = (req, res) => {
    res.render('add-User');
}

//Add users
exports.create = 
(req, res) => {
    

    const {first_name, last_name, email, phone, comments} = req.body;
    
    pool.getConnection((err, connection) => {
        if (err) throw err;
        //User the connection
        connection.query('INSERT into user SET first_name = ?, last_name = ?,email = ?, phone = ?, comments = ?',[first_name, last_name,email,phone,comments], (err, rows) => {
            connection.release();
            if (!err) {
                res.render('add-User', { alert: 'User Added Successfully!' });
            } else {
                console.log(err);
            }
            //console.log('Data from user table : \n ', rows)
        });
    });

}

//Edit users
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        //User the connection
        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id],(err, rows) => {

            //When done with connection, release it
            connection.release();

            if (!err) {
                res.render('edit-User', { rows });
            } else {
                console.log(err);
            }
        });
    });
}

//Update users
exports.update = (req, res) => {
    const{first_name, last_name, email, phone, comments} = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        //User the connection
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ? , comments = ? WHERE id = ?',[first_name, last_name,email,phone,comments, req.params.id],(err, rows) => {

            //When done with connection, release it
            connection.release();

            if (!err) {

                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    //User the connection
                    connection.query('SELECT * FROM user WHERE id = ?',[req.params.id],(err, rows) => {
            
                        //When done with connection, release it
                        connection.release();
            
                        if (!err) {
                            res.render('edit-User', { rows, alert: 'User Updated Successfully!' });
                        } else {
                            console.log(err);
                        }
                    });
                });

            } else {
                console.log(err);
            }
        });
    });
}


//Delete users
exports.delete = (req, res) => {
   
    pool.getConnection((err, connection) => {
        if (err) throw err;
        //User the connection
        connection.query('DELETE FROM user WHERE id = ?',[req.params.id],(err, rows) => {
            //When done with connection, release it
            connection.release();
            if (!err) {
                let removedUser = encodeURIComponent('User Removed!');
                res.redirect('/?removed= ' + removedUser);
            } else {
                console.log(err);
            }
        });
    });
   
 /*
    pool.getConnection((err, connection) => {
        if (err) throw err;
        //User the connection
        connection.query('UPDATE user SET status = ? WHERE id = ?',['removed',req.params.id],(err, rows) => {
            //When done with connection, release it
            connection.release();
            if (!err) {
                let removedUser = encodeURIComponent('User Removed!');
                res.redirect('/?removed= ' + removedUser);
            } else {
                console.log(err);
            }
        });
    }); */
}

//View users
exports.viewdata = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        //console.log('Connection ID ' + connection.threadId)

        //User the connection
        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id],(err, rows) => {

            //When done with connection, release it
            connection.release();

            if (!err) {
                res.render('view-User', { rows });

            } else {
                console.log(err);
            }
            //console.log('Data from user table : \n ', rows)
        });
    });
}
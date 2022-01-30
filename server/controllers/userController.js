const mysql = require('mysql');


//Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});




//View users
exports.view = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        //console.log('Connection ID ' + connection.threadId)

        //User the connection
        connection.query('SELECT * FROM user', (err, rows) => {

            //When done with connection, release it
            connection.release();

            if (!err) {
                res.render('home', { rows });

            } else {
                console.log(err);
            }
            console.log('Data from user table : \n ', rows)
        });
    });
}


//Search users
exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        //console.log('Connection ID ' + connection.threadId)


        let searchValue = req.body.search;
        //console.log(searchValue);



        //User the connection
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchValue + '%', '%' + searchValue + '%'], (err, rows) => {

            //When done with connection, release it
            connection.release();

            if (!err) {
                res.render('home', { rows });

            } else {
                console.log(err);
            }
            console.log('Data from user table : \n ', rows)
        });
    });

}

exports.form = (req, res) => {
    res.render('add-User');

}


//Add users
exports.create = (req, res) => {
    const{first_name, last_name, email, phone, comments} = req.body;
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
            console.log('Data from user table : \n ', rows)
        });
    });

}
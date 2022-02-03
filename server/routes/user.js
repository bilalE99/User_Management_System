const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const mysql = require('mysql');


//Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


const userController = require('../controllers/userController');
//const validateCreateUser = require('../controllers/validationController');
/*
.withMessage('First name must be within 2 to 45 characters')
withMessage('Last name must be within 2 to 45 characters')
.withMessage('Invalid email!')
*/
//route crud functions
router.get('/', userController.view);
router.post('/', userController.find);

router.get('/adduser', userController.form);

router.post('/adduser',
    [
        check('first_name').trim().isLength({ min: 3 }).escape().withMessage('First name must be at least 3 characters'),
        check('last_name').trim().isLength({ min: 3 }).escape().withMessage('Last name must be at least 3 characters'),
        check('email').trim().isEmail().normalizeEmail().withMessage('A valid email is required'),
    ],

    (req, res) => {
        const { first_name, last_name, email, phone, comments } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //return res.status(400).json({ errors: errors.array() });
            res.render('add-User', { errors: errors.array() });
            console.log(errors.array())
        }
        else {
            pool.getConnection((err, connection) => {
                if (err) throw err;
                //User the connection
                connection.query('INSERT into user SET first_name = ?, last_name = ?,email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
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
    });

router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);

router.get('/viewuser/:id', userController.viewdata);
router.get('/:id', userController.delete);



module.exports = router;;
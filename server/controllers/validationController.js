
const { check, validationResult } = require('express-validator')


exports.validateCreateUser = [
  check('first_name').trim().isLength({ min: 3 }).escape().withMessage('First name must be at least 3 characters'),
  check('last_name').trim().isLength({ min: 3 }).escape().withMessage('Last name must be at least 3 characters'),
  check('email').trim().isEmail().normalizeEmail().withMessage('A valid email is required'),
];

exports.userValidation = (req, res, next) => {
  const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //return res.status(400).json({ errors: errors.array() });
            res.render('add-User', { errors: errors.array() });
            console.log(errors.array())
        }
};


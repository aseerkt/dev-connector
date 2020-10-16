const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

require('dotenv').config();

const router = express.Router();

// @route   POST /api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get user gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      await user.save();
      console.log(user.id);

      // Return JWT
      const payload = {
        user: {
          id: user.id,
        },
      };
      // console.log(payload);
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return res.json({ token });
    } catch (err) {
      return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

module.exports = router;

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middlewares/auth');
const User = require('../../models/User');

// @route   GET /api/auth
// @desc    Get Authenticated User
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select('-password');
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/auth
// @desc    Login User
// @access  Public
router.post(
  '/',
  [
    check('email', 'Email is invalid').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const paylaod = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(paylaod, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return res.json({ token });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

module.exports = router;

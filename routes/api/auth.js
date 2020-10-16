const express = require('express');
const router = express.Router();
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

module.exports = router;

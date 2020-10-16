const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const Profile = require('../../models/Profile');

// @route   GET /api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('User', ['name', 'image']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;

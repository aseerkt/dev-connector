const express = require('express');
const { check, validationResult } = require('express-validator');
const axios = require('axios');
const auth = require('../../middlewares/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

const router = express.Router();

// @route   GET /api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('User', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// @route     POST /api/profile
// @desc      Create or Update profile
// @access    Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    // console.log(profileFields.skills);

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          {
            $set: {
              ...profileFields,
              social: { ...profile.social, ...profileFields.social },
            },
          },
          { new: true }
        );
        return res.json(profile);
      }
      // Create
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    GET /api/profile
// @desc     Get All profiles
// @acess    Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    return res.json(profiles);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// @route   GET /api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(404).json({ msg: 'Profile Not Found' });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Profile Not Found' });
    }
    return res.status(500).send('Server Error');
  }
});

// @route    DELETE /api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ author: req.user.id });
    // Remove user profile
    await Profile.deleteOne({ user: req.user.id });
    await User.deleteOne({ _id: req.user.id });
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// @route     PUT /api/profile/experience
// @desc      Add experience to profile
// @access    Private
router.put('/experience', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    const newExp = { title, company, location, from, to, current, description };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err);
      return res.status(500).send('Server Error');
    }
  },
]);

// @route    DELETE /api/profile/experience/:expId
// @desc     Delete experience
// @access   Private
router.delete('/experience/:expId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience = profile.experience.filter(
      (exp) => exp.id !== req.params.expId
    );
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route     PUT /api/profile/education
// @desc      Add education to profile
// @access    Private
router.put('/education', [
  auth,
  [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err);
      return res.status(500).send('Server Error');
    }
  },
]);

// @route    DELETE /api/profile/education/:eduId
// @desc     Delete education
// @access   Private
router.delete('/education/:eduId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education = profile.education.filter(
      (exp) => exp.id !== req.params.eduId
    );
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET /api/profile/github/:username
// @desc     Get github repos
// @access   Public
router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
    };
    const githubResponse = await axios.get(uri, { headers });
    return res.json(githubResponse.data);
  } catch (err) {
    console.log(err.message);
    if (err.response.status === 404) {
      return res.status(404).json({ msg: 'No github profiles found' });
    }
    return res.status(500).send('Server Error');
  }
});
module.exports = router;

const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middlewares/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');

const router = express.Router();

// @route   POST /api/posts
// @desc    Add Post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id);
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        author: req.user.id,
      });
      const post = await newPost.save();
      return res.json(post);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

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

// @route    GET /api/posts
// @desc     Get all posts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    GET /api/posts/:postId
// @desc     Get post by Id
// @access   Private
router.get('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }
    return res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }
    return res.status(500).send('Server Error');
  }
});

// @route    DELETE /api/posts/:postId
// @desc     Delete a post
// @access   Private
router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }
    // Check user
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    return res.json({ msg: 'Post removed' });
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }
    return res.status(500).send('Server Error');
  }
});

// @route     PUT /api/posts/like/:postId
// @desc      Like a post
// @access    Private
router.put('/like/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    // Check if user already liked the post
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route     PUT /api/posts/unlike/:postId
// @desc      Unlike a post
// @access    Private
router.put('/unlike/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    // Check if user already liked the post
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // remove the like
    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route     POST /api/posts/comment/:id
// @desc      Comment on a post
// @access    Private
router.post(
  '/comment/:postId',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { text } = req.body;
    try {
      const user = await User.findById(req.user.id);
      const post = await Post.findById(req.params.postId);
      post.comments.unshift({
        text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      await post.save();
      return res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route     DELETE /api/posts/:postId/:commentId
// @desc      Delete a comment
// @access    Private
router.delete('/comment/:postId/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    // Pull out comment
    const comment = post.comments.find(
      (comm) => comm._id == req.params.commentId
    );
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    post.comments = post.comments.filter(
      (comm) => comm._id != req.params.commentId
    );
    await post.save();
    return res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;

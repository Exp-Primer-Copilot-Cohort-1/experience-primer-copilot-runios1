// Create web server
const express = require('express');
// Create router
const router = express.Router();
// Bring in User Model
const User = require('../../models/User');
// Bring in Profile Model
const Profile = require('../../models/Profile');
// Bring in Post Model
const Post = require('../../models/Post');
// Bring in Comment Model
const Comment = require('../../models/Comment');
// Bring in authorization middleware
const auth = require('../../middleware/auth');
// Bring in express-validator
const { check, validationResult } = require('express-validator');

// @route   POST api/comments/:postId
// @desc    Create a comment
// @access  Private
router.post(
  '/:postId',
  [
    auth,
    [
      check('text', 'Text is required').not().isEmpty(),
      check('postId', 'Post ID is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return bad request with errors array
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Find post by id
      const post = await Post.findById(req.params.postId);
      // If post does not exist
      if (!post) {
        // Return not found
        return res.status(404).json({ msg: 'Post not found' });
      }

      // Create new comment object
      const newComment = new Comment({
        text: req.body.text,
        user: req.user.id,
        post: req.params.postId,
      });

      // Save comment
      const comment = await newComment.save();

      // Return comment
      res.json(comment);
    } catch (err) {
      // Log error to console
      console.error(err.message);
      // Return internal server error
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/comments/:postId
// @desc    Get all comments for a post
// @access  Private
router.get('/:postId', auth, async (req, res) => {
  try {
    // Find post by id
    const post = await Post.findById(req.params.postId);
    // If post does not exist
    if (!post) {
      // Return not found
      return res.status(404).json({ msg: '' });}}););
const express = require('express');
const Comment = require('../models/Comment');

const router = express.Router();

router.post('/:postId', async (req, res) => {
    const { content } = req.body;
    const author = req.header('userId');
    try {
        const comment = await Comment.create({
            content,
            author,
            post: req.params.postId,
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

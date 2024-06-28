const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); 
const Post = require('../models/Post'); 
const Like = require('../models/Like');

router.post('/create', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const author = req.header('userId'); 

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image file not provided' });
        }
        const imagePath = req.file.path;

        const newPost = new Post({
            title,
            content,
            author,
            image: imagePath,
            likecount: 0
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({
            title: post.title,
            content: post.content,
            author: post.author.username,
            image: post.image,
            likecount: post.likecount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/like/:id', async (req, res) => {
    const userId = req.body.userId; // Assume userId is sent in the request body
    const postId = req.params.id;

    try {
        // Check if the user has already liked the post
        const existingLike = await Like.findOne({ post: postId, user: userId });

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (existingLike) {
            await existingLike.deleteOne();
            post.likecount -= 1;
        } else {
            const newLike = new Like({ post: postId, user: userId });
            await newLike.save();
            post.likecount += 1;
        }

        await post.save();
        res.json({ likecount: post.likecount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/checklike/:id/:userId', async (req, res) => {
    const postId = req.params.id;
    const userId = req.params.userId;

    try {
        // Check if the user has already liked the post
        const existingLike = await Like.findOne({ post: postId, user: userId });

        if (existingLike) {
            res.json({ liked: true });
        } else {
            res.json({ liked: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/myblogs/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; // Assuming user ID is available in the req.user object after authentication
        const posts = await Post.find({ author: userId });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;






module.exports = router;

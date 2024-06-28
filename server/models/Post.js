const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    likecount: {
        type: Number, 
        required: true,
        default: 0, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Virtual field to compute number of likes
PostSchema.virtual('likesCount', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'post',
    count: true,
});

module.exports = mongoose.model('Post', PostSchema);

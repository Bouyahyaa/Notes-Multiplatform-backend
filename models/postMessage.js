import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    body: String,
    likeCount: {
        type: Number,
        default: 0,
    },
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;
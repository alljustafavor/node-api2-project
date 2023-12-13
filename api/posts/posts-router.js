const express = require('express');
const Post = require('./posts-model');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'The posts information could not be retrieved' });
    }
})

router.post('/', async (req, res) => {
    try {
        const { title, contents } = req.body;
        if (!title || !contents) {
            res.status(400).json({ message: 'Please provide title and contents for the post' });
        } else {
            const create_post = await Post.insert({ title, contents });
            if (create_post) {
                const full_created_post = await Post.findById(create_post.id);
                res.status(201).json(full_created_post);
            } else {
                throw new Error();
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'There was an error while saving the post to the database' });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id)
        if (!post) {
            res.status(404).json({ message: 'The post with the specified ID does not exist' })
        } else {
            res.status(200).json(post)
        }
    } catch (error) {
        res.status(500).json({ message: 'The post information could not be retrieved' });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, contents } = req.body;
        if (!title || !contents) {
            res.status(400).json({ message: 'Please provide title and contents for the post' });
        } else {
            const post = await Post.update(id, { title, contents });
            if (!post) {
                res.status(404).json({ message: 'The post with the specified ID does not exist' });
            } else {
                const update_post = await Post.findById(id);
                res.status(200).json(update_post);
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'The post information could not be modified' });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted_post = await Post.findById(id)
        const post = await Post.remove(id);
        if (!post) {
            res.status(404).json({ message: 'The post with the specified ID does not exist' });
        } else {
            res.status(200).json(deleted_post);
        }
    } catch (error) {
        res.status(500).json({ message: 'The post could not be removed' });
    }
})

router.get('/:id/comments', async (req,res) => {
    try {
        const { id } = req.params;
        const post_comments = await Post.findCommentById(id)
        if (!post_comments) {
            res.status(404).json({ message: 'The post with the specified ID does not exist' })
        } else {
            const all_post_comments = await Post.findPostComments(id)
            res.status(200).json(all_post_comments)
        }
    } catch (error) {
        res.status(500).json({ message: 'The comments information could not be retrieved' });
    }
})

module.exports = router
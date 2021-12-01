// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')

const router = express.Router()

// Get posts

router.get('/', (req,res) => {
    Posts.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: 'The posts information could not be retrieved'
            })
        })
})

// Get post by id 

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist "})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The post information could not be retrieved"})
        })
})

router.post('/', async (req, res) => {
    try {
        if(!req.body.title || !req.body.contents) {
            res.status(400).json({ message: "Please provide title and contents for the post"})
        } else {
            const newPost =  await Posts.insert(req.body)
            res.status(201).json
            res.json(newPost)
            
            
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error while saving the post to the database",
            error: err.message
        })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req
    try {
        if (!req.body.title || !req.body.contents) {
            res.status(400).json({ message: "Please provide title and contents for the post"})
        } else {
            const updated = await Posts.update(id, body)
            if (!updated) {
                res.status(404).json({ message: "The post with the specified ID does not exist"})
            } else {
                res.status(200).json
                res.json(updated)
            }
        }
    } catch (err) {
        res.status(500).json({ message: "The post information could not be modified" })
    }
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    Posts.remove(id)
        .then(deletedPost => {
            if (!deletedPost) {
                res.status(404).json({ message: "The post with the specified ID does not exist"})
            } else {
                res.status(200).json
                res.json(deletedPost)
            }
        }) 
        .catch(err => {
            res.status(500).json({ message: "The post with the specified ID does not exist", error: err.message})
        })
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params
    Posts.findCommentById(id)
        .then(post => {
            if(!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist"})
            } else {
                console.log(post)
            }
        })
        .catch (err => {
            res.status(500).json({ message: "The comments information could not be retrieved"})
        })
})

module.exports = router;
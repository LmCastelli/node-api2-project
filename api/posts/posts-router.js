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

            res.status(201).json(newPost)
            
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error while saving the post to the database",
            error: err.message
        })
    }
})

router.put('/')

module.exports = router;
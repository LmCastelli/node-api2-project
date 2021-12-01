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

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if(!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post"})
    } else {
        Posts.insert({title, contents })  
            .then(({ id }) => {
                return Posts.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    err: err.message,
                })
            }) 
    }
})

router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if(!title ||  !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post"})
    } else {
        Posts.findById(req.params.id)
            .then(stuff => {
                if (!stuff) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                } else {
                    return Posts.update(req.params.id, req. body)
                }
            })
            .then(post => {
                if (post) {
                    return Posts.findById(req.params.id)
                }
            })
            .then(post2 => {
                if (post2) {
                    res.json(post2)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "The posts information could not be retrieved",
                    error: err.message
                })
            })
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            await Posts.remove(req.params.id)
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            err: err.message
        })
    }
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
            res.status(500).json({ message: "The comments information could not be retrieved", error: err.message})
        })
})

module.exports = router;
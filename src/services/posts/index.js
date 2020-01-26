const {
    Router
} = require('express')
const router = Router()
const posts = require('../models/posts')
const users = require('../models/users')
const {
    ObjectId
} = require('mongodb')
const multer = require('multer')
const {
    extname,
    join
} = require('path')

//Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(__dirname, '../../../public/posts/'))
    },
    filename: (req, file, cb) => {
        cb(null, `${req.params.postId}${extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
})

/**
 * Posts 
 */
router.get("/", async (req, res) => {
    try {
        let request = await posts.find({})
        res.status(200).send(request)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/", async (req, res) => {
    try {
        const request = await posts.create(req.body)
        request.save()
        res.send(request)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/post/:username", async (req, res) => {
    try {
        let post = await posts.find({
            username: req.params.username
        })
        let user = await users.find({
            username: req.params.username
        })
        let response = [{
            user: user,
            posts: post
        }]
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/:postId", async (req, res) => {
    try {
        let request = await posts.find({
            _id: req.params.postId
        })
        if (!request.length > 0)
            res.status(404).send('POST NOT FOUND')
        res.status(200).send(request)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put("/:postId", async (req, res) => {
    try {
        let request = await posts.findOneAndUpdate({
            _id: req.params.postId
        }, {
            ...req.body
        }, {
            new: true
        })
        res.send(request)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete("/:postId", async (req, res) => {
    try {
        let request = await posts.findByIdAndDelete(req.params.postId)
        res.send('DELETED')
    } catch (error) {
        res.status(500).send(error)
    }
})
/**
 * Multer
 * to upload picture
 */
router.post("/:postId", upload.single('posts'), async (req, res, next) => {
    try {
        let request = await posts.find({
            _id: req.params.postId
        })
        if (!request.length > 0)
            return res.status(404).send('POST NOT FOUND')
        if (!req.file)
            return res.status(500).send('select an image')

        let fileName = `${req.params.postId}${extname(req.file.originalname)}`
        let imageUrl = `${req.protocol}://${req.get('host')}/posts/${fileName}`
        req.body.image = imageUrl
        let updateRequest = await posts.findOneAndUpdate({
            _id: req.params.postId
        }, {
            ...req.body
        }, {
            new: true
        })

        res.send(updateRequest)

    } catch (error) {

    }
})

router.post('/:id/comment', async (req, res) => {
    try {
        const newComment = {
            ...req.body,
            post: req.params.id
        }
        const comment = await posts.findByIdAndUpdate(req.params.id, {
            $push: {
                comments: newComment
            }
        }, {
            new: true
        })
        res.send(comment.comments);
    } catch (error) {
        res.status(500).send(error);
    }
})
/**
 * Comments
 * Get all comments
 */
router.get('/:id/comment', async (req, res) => {
    try {
        const result = await posts.find({
            _id: req.params.id
        });
        res.send(result.comments)
    } catch (error) {
        res.status(500).send(error)
    }
})

/**
 * GET specific comment 
 */
router.get("/:id/comment/:commentId", async (req, res, next) => {
    try {
        const singleComment = await posts.findOne({
            _id: new ObjectId(req.params.id),
            "comments._id": new ObjectId(req.params.commentId)
        }, {
            "comments.$": 1
        })
        res.status(200).send(singleComment)
    } catch (error) {
        res.status(500).send(error)
    }
})

/**
 * Edit comment
 */
router.patch("/:id/comment/:commentId", async (req, res, next) => {
    try {
        const comments = await posts.updateOne({
            _id: new ObjectId(req.params.id),
            "comments._id": new ObjectId(req.params.commentId)
        }, {"comments.$": req.body}, {new: true})
        res.send("succefully edited!!!!")
    } catch (error) {
        res.status(500).send(error)
    }
})

/**hh
 * Delete comment
 */
router.delete('/:id/comment/:commentId', async (req, res) => {
    try {
        const comment = await posts.findByIdAndUpdate(req.params.id, {
            $pull: {
                comments: {
                    _id: new ObjectId(req.params.commentId)
                }
            }
        });
        res.send('Removed ')
    } catch (error) {
        res.status(500).send(error)
    }
})

/**
 * Post likes
 */
router.post('/:id/likes', async (req, res) => {
    try {
        const newLikes = {
            ...req.body,
            post: req.params.id
        }
        const like = await posts.findByIdAndUpdate(req.params.id, {
            $push: {
                likes: newLikes
            }
        }, {
            new: true
        })
        res.send(like.likes);
    } catch (error) {
        res.status(500).send(error);
    }
})
/**
 * Delete likes
 * 
 */

router.delete('/:id/likes/:likeId', async (req, res) => {
    try {
        const like = await posts.findByIdAndUpdate(req.params.id, {
            $pull: {
                likes: {
                    _id: new ObjectId(req.params.likeId)
                }
            }
        });
        res.send('Removed ')
    } catch (error) {
        res.status(500).send(error)
    }
})
module.exports = router
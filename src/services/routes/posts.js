const {
    Router
} = require('express')
const router = Router()
const PostModel = require('../models/posts')
const UserModel = require('../models/users')
const multer = require('multer')
const passport = require('passport')
const {
    extname,
    join
} = require('path')

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

router.get("/", passport.authenticate("jwt"), async (req, res) => {
    try {
        let request = await PostModel.find({})
        res.status(200).send(request)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/", passport.authenticate("jwt"), async (req, res) => {
    try {
        const request = await PostModel.create(req.body)
        request.save()
        res.status(200).send(request)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/:userID", passport.authenticate("jwt"), async (req, res) => {
    try {
        let post = await PostModel.find({
            username: req.params.userID
        })
        let user = await UserModel.find({
            username: req.params.userID
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

router.get("/id/:postId", passport.authenticate("jwt"), async (req, res) => {
    try {
        let request = await PostModel.find({
            _id: req.params.postId
        })
        if (!request.length > 0)
            res.status(404).send('POST NOT FOUND')
        res.status(200).send(request)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.put("/id/:postId", passport.authenticate("jwt"), async (req, res) => {
    let post = await PostModel.findById(req.params.postId)
    if (req.user.username === post.username) {
        try {
            let request = await PostModel.findOneAndUpdate({
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
    } else {
        res.status(401).send('Unauthorized')
    }
})

router.delete("/id/:postId", passport.authenticate("jwt"), async (req, res) => {
    let post = await PostModel.findById(req.params.postId)
    if (req.user.username === post.username) {
        try {
            let request = await PostModel.findByIdAndDelete(req.params.postId)
            res.send('DELETED')
        } catch (error) {
            res.status(500).send(error)
        }
    } else {
        res.status(401).send('Unauthorized')
    }
})

/* router.post("/id/:postId", passport.authenticate("jwt"), upload.single('posts'), async (req, res, next) => {
    try {
        let request = await PostModel.find({
            _id: req.params.postId
        })
        if (!request.length > 0)
            return res.status(404).send('POST NOT FOUND')
        if (!req.file)
            return res.status(500).send('select an image')
        let fileName = `${req.params.postId}${extname(req.file.originalname)}`
        let imageUrl = `${req.protocol}://${req.get('host')}/posts/${fileName}`
        req.body.image = imageUrl
        let updateRequest = await PostModel.findOneAndUpdate({
            _id: req.params.postId
        }, {
            ...req.body
        }, {
            new: true
        })
        res.status(200).send(updateRequest)
    } catch (error) {
        res.status(500).send(error)
    }
}) */

module.exports = router
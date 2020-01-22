const {
    Router
} = require('express')
const router = Router()
const posts = require('../models/posts')
const multer = require('multer')
const {extname, join} = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(__dirname, '../../../public/posts/'))
    },
    filename: (req, file, cb) => {
        cb(null, `${req.params.postId}${extname(file.originalname)}`)
    }
})

const upload = multer({storage: storage})

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

router.post("/:postId", upload.single('posts'), async (req, res, next) => {
    try {
        let request = await posts.find({
            _id: req.params.postId
        })
        if (!request.length > 0) 
           return res.status(404).send('POST NOT FOUND')
        if(!req.file)
           return res.status(500).send('select an image')
        
        let fileName = `${req.params.postId}${extname(req.file.originalname)}`
        let imageUrl = `${req.protocol}://${req.get('host')}/public/posts/${fileName}`
        req.body.image = imageUrl
       let updateRequest = await posts.findOneAndUpdate({_id: req.params.postId}, {...req.body}, {new: true})

       res.send(updateRequest)
        
    } catch (error) {
        
    }
})
module.exports = router
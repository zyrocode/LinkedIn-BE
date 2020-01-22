const {Router} = require('express')
const router = Router()
const posts = require('../models/posts')

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

router.put()
module.exports = router

const express = require('express');
const router = express.Router();
const UserModel = require('../models/users');
const pdfGenerator = require("../../pdf/pdfgenerator")
const path = require("path")
const json2csv = require("json2csv").parse
const fs = require("fs-extra")
const passport = require('passport')
const {
    ObjectId
} = require('mongodb');

//USER
//GET all users
router.get('/', passport.authenticate("jwt"), async (req, res) => {
    const results = await UserModel.find({});
    res.send(results);
})

//GET user by id
router.get('/:id', passport.authenticate("jwt"), async (req, res) => {
    const result = await UserModel.find({
        username: req.params.id
    });
    res.send(result);
})

//POST user
router.post('/', passport.authenticate("jwt"), async (req, res) => {
    if (req.params.id === req.user.username) {
        try {
            const result = await UserModel.create(req.body);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send(error)
        }
    } else {
        res.status(401).send('Unauthorized')
    }
})

router.put('/:id', passport.authenticate("jwt"), async (req, res) => {
    if (req.params.id === req.user.username) {
        try {
            delete req.body._id;
            const userID = await UserModel.find({
                username: req.params.id
            })
            const edited = await UserModel.findByIdAndUpdate(userID[0]._id, {
                $set: {
                    ...req.body
                }
            });
            if (edited) {
                res.status(200).send(edited);
            } else {
                res.status(404).send('user not found');
            }
        } catch (error) {
            res.status(500).send(error)
        }
    } else {
        res.status(401).send('Unauthorized')
    }
})

router.delete('/:id', passport.authenticate("jwt"), async (req, res) => {
    if (req.params.id === req.user.username) {
        try {
            const userID = await user.find({
                username: req.params.id
            })
            const deleted = await user.findByIdAndDelete(userID[0]._id);
            if (deleted) {
                res.status(200).send('Removed');
            } else {
                res.status(404).send('user not found');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(401).send('Unauthorized')
    }
})
//Experience

//GET All experience from user
router.get('/:id/experience', async (req, res) => {
    const userID = await UserModel.find({
        username: req.params.id
    });
    const result = await UserModel.findById(userID);
    res.status(200).send(result.experience)
})

//GET specific experience from user
router.get('/:id/experience/:expid', async (req, res) => {
    const userID = await UserModel.find({
        username: req.params.id
    })
    const singleExperience = await UserModel.findOne({
        _id: new ObjectId(userID[0]._id),
        "experience._id": new ObjectId(req.params.expid)
    }, {
        "experience.$": 1
    })
    res.status(200).send(singleExperience);
})

//POST experience on user
router.post('/:id/experience', passport.authenticate("jwt"), async (req, res) => {
    if (req.params.id === req.user.username) {
        const newExperience = req.body
        const userID = await UserModel.find({
            username: req.params.id
        })
        try {
            const experience = await UserModel.findByIdAndUpdate(userID[0]._id, {
                $push: {
                    experience: newExperience
                }
            })
            res.status(200).send(experience);
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(401).send('Unauthorized')
    }
})

//EDIT specific experience on a specific user
router.patch('/:id/experience/:expid', passport.authenticate("jwt"), async (req, res) => {
    if (req.params.id === req.user.username) {
        try {
            const userID = await UserModel.find({
                username: req.params.id
            })
            const experience = await UserModel.updateOne({
                _id: new ObjectId(userID[0]._id),
                "experience._id": new ObjectId(req.params.expid)
            }, {
                "experience.$": req.body
            })
            res.send('edited');
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    } else {
        res.status(401).send('Unauthorized')
    }
})

//DELETE a specific experience from a specific user
router.delete('/:id/experience/:expid', passport.authenticate("jwt"), async (req, res) => {
    if (req.params.id === req.user.username) {
        try {
            const userID = await UserModel.find({
                username: req.params.id
            })
            const toDelete = await UserModel.findByIdAndUpdate(userID[0]._id, {
                $pull: {
                    experience: {
                        _id: new ObjectId(req.params.expid)
                    }
                }
            });
            res.status(200).send('Removed experience');
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    } else {
        res.status(401).send('Unauthorized')
    }
})

//PDF
router.get('/:id/pdf', passport.authenticate("jwt"), async (req, res) => {
    const userID = await UserModel.find({
        username: req.params.id
    })
    const response = await UserModel.findById(userID[0]._id)
    await pdfGenerator(response)
    const file = path.join(__dirname, `../../pdf/${response._id}.pdf`);
    res.setHeader("Content-Disposition", `attachment; filename=${response._id}.pdf`);
    fs.createReadStream(file).pipe(res);
})

//CSV
router.get('/:id/csv', passport.authenticate("jwt"), async (req, res) => {
    const userID = await UserModel.find({
        username: req.params.id
    })
    const response = await UserModel.findById(userID[0]._id)
    const fields = ["role", "company", "area"]
    const opts = {
        fields
    }
    try {
        let csv = json2csv(response.experience, opts)
        res.status(200).send(csv)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;
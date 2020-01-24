const express = require('express');
const router = express.Router();
const user = require('../models/users/index');
const pdfGenerator = require("../../pdf/pdfgenerator")
const path = require("path")
const json2csv = require("json2csv").parse
const fs = require("fs-extra")
const {
    ObjectId
} = require('mongodb');

//USER
//GET all users
router.get('/', async (req, res) => {
    const results = await user.find({});
    console.log('Fetching data');
    res.send(results);
})

//GET user by id
router.get('/:id', async (req, res) => {
    const result = await user.find({username: req.params.id});
    console.log('Fetching data by Id');
    res.send(result);
})

//POST user
router.post('/', async (req, res) => {
    try {
        const result = await user.create(req.body);
        console.log('Posting data');

        res.send(result);
    } catch (err) {

        res.send(err)
        console.log(err);
    }
})


//POST image for users Multer
// router.post('/:id/images',(req,res)=>{

// })

router.put('/:id', async (req, res) => {
    try {
        console.log('editing data');
        delete req.body._id;
        const userID = await user.find({username: req.params.id})
        const edited = await user.findByIdAndUpdate(userID[0]._id, {
            $set: {
                ...req.body
            }
        });
        if (edited) {
            res.send(edited);
        } else {
            res.status(404).send('user not found');
        }
    } catch (err) {
        console.log(err);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const userID = await user.find({username: req.params.id})
        const deleted = await user.findByIdAndDelete(userID[0]._id);
        if (deleted) {
            res.send('Removed');
        } else {
            res.status(404).send('user not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('server error');
    }

    console.log('deleting data');
})

//Experience
//GET All experience from user
router.get('/:id/experience', async (req, res) => {
    const userID = await user.find({username: req.params.id});
    const result = await user.findById(userID);
    res.send(result.experience)
    console.log('Fetching all experience from a user');
})

//GET specific experience from user
router.get('/:id/experience/:expid', async (req, res) => {
    const userID = await user.find({username: req.params.id})
    const singleExperience = await user.findOne({
        _id: new ObjectId(userID[0]._id),
        "experience._id": new ObjectId(req.params.expid)
    }, {
        "experience.$": 1
    })
    // const singleExperience = await user.findById(req.params.id, experience._id = req.params.expid)
    res.send(singleExperience);
    console.log('fetching 1 experience from a user')
})

//POST experience on user
router.post('/:id/experience', async (req, res) => {
    console.log('posting experience to a user');
    const newExperience = req.body
    const userID = await user.find({username: req.params.id})
    console.log(userID[0]._id)
    try {
        const experience = await user.findByIdAndUpdate(userID[0]._id, {
            $push: {
                experience: newExperience
            }
        })
        res.send(experience);
    } catch (err) {
        res.status(500).send(err);
    }
})

//EDIT specific experience on a specific user
router.patch('/:id/experience/:expid', async (req, res) => {
    try {
        const userID = await user.find({username: req.params.id})
        const experience = await user.updateOne({
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
    console.log('editing an experience from a user')
})


//DELETE a specific experience from a specific user
router.delete('/:id/experience/:expid', async (req, res) => {
    try {
        console.log('deleting an experience from a user');
        const userID = await user.find({username: req.params.id})
        const toDelete = await user.findByIdAndUpdate(userID[0]._id, {
            $pull: {
                experience: {
                    _id: new ObjectId(req.params.expid)
                }
            }
        });
        res.send('Removed experience');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

//PDF
router.get('/:id/pdf', async (req, res) => {
    console.log('pdf');
    const userID = await user.find({username: req.params.id})
    const response = await user.findById(userID[0]._id)
    await pdfGenerator(response)
    const file = path.join(__dirname, `../../pdf/${response._id}.pdf`);
    res.setHeader("Content-Disposition", `attachment; filename=${response._id}.pdf`);
    fs.createReadStream(file).pipe(res);
})



//CSV
router.get('/:id/csv', async (req, res) => {
    console.log('csv')
    const userID = await user.find({username: req.params.id})
    const response = await user.findById(userID[0]._id)
    const fields = ["role", "company", "area"]
    const opts = {
        fields
    }
    try {
        let csv = json2csv(response.experience, opts)
        res.send(csv)
    } catch (err) {
        res.status(500).send(err)
    }
})





module.exports = router;
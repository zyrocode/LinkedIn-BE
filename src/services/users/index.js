const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const multer = require ('multer');
const user = require ('../models/users/index');
const { ObjectId } = require ('mongodb');

//USER
//GET all users
router.get('/', async (req,res)=>{
    const results = await user.find({});
    console.log('Fetching data');
    res.send(results);
})

//GET user by id
router.get('/:id', async (req,res)=>{
    const result = await user.findById(req.params.id);
    console.log('Fetching data by Id');
    res.send(result);
})

//POST user
router.post('/', async(req,res)=>{
    try{
        const result = await user.create(req.body);
        console.log('Posting data');
        res.send(result);
    } catch(err){
        res.send(err)
        console.log(err);
    }
})

//POST image for users Multer
const multerConfig = multer({});
router.post('/:id/images/upload',multerConfig.single('profilePic'), async (req,res)=>{
    try {
    const ext = path.extname(req.file.originalname);
    console.log(ext);
    const fileDestination = path.join("./images/users", req.params.id + ext);
    console.log(fileDestination);
    const imageLink = req.protocol + "://" + req.get("host") + "/images/users/" + req.params.id + ext ;
    console.log(imageLink);
    await fs.writeFile(fileDestination, req.file.buffer);
        const userImage = await user.findByIdAndUpdate(req.params.id, {
            image: imageLink
        },{
            new: true
        });
        res.send(userImage)
    } catch (error) {
        res.status(500).send(error);
    }
})

router.put('/:id', async(req,res)=>{
    try{
        console.log('editing data');
        delete req.body._id;
        const edited = await user.findByIdAndUpdate(req.params.id, {$set: {...req.body}});
        if (edited) {
            res.send(edited);
        } else{
            res.status(404).send('user not found');
        }
    } catch(err){
        console.log(err);
    }
})

router.delete('/:id', async(req,res)=>{
    try{
        const deleted = await user.findByIdAndDelete(req.params.id);
        if (deleted){
            res.send('Removed');
        } else{
            res.status(404).send('user not found');
        }
    } catch (err){
        console.log(err);
        res.status(500).send('server error');
    }

    console.log('deleting data');
})

//Experience
//GET All experience from user
router.get('/:id/experience', async(req,res)=>{
    const result = await user.findById(req.params.id);
    res.send(result.experience)
    console.log('Fetching all experience from a user');
})

//GET specific experience from user
router.get('/:id/experience/:expid', async (req,res)=>{
    const singleExperience = await user.findOne(
        {
        _id: new ObjectId(req.params.id),
        "experience._id": new ObjectId(req.params.expid)
    },{
            "experience.$":1
    })
    // const singleExperience = await user.findById(req.params.id, experience._id = req.params.expid)
    res.send(singleExperience);
    console.log('fetching 1 experience from a user')
})

//POST experience on user
router.post('/:id/experience', async(req,res)=>{
    console.log('posting experience to a user');
    const newExperience = req.body
    try{
        const experience = await user.findByIdAndUpdate(req.params.id, {$push:{experience: newExperience}})
        res.send(experience);
    } catch (err) {
        res.status(500).send('server error');
    }
})


//POST Experience Image (multer)
router.post('/:id/experience/:expid/image/upload',multerConfig.single('expimage'), async(req,res)=>{
    const ext = path.extname(req.file.originalname);
    console.log(ext);
    const fileDestination = path.join('./images/experience', req.params.expid + ext);
    console.log(fileDestination);
    const expImage = req.protocol + "://" + req.get('host') + "/images/experience/" + req.params.expid + ext;
    console.log(expImage);
    await fs.writeFile (fileDestination, req.file.buffer);
    const newImage = await user.updateOne({
        _id : new ObjectId (req.params.id),
        "experience._id": new Object (req.params.expid)
    },{ "$set":
        {"experience.$.image": expImage}
    }
    )
    console.log(newImage);
    res.send(newImage)
})
//EDIT specific experience on a specific user
router.patch('/:id/experience/:expid', async(req,res)=>{
    try {
        const experience = await user.updateOne(
        {
            _id: new ObjectId(req.params.id),
            "experience._id":new ObjectId(req.params.expid)
        },{
            "experience.$":req.body
        })
        res.send('edited');
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
    console.log('editing an experience from a user')
})


//DELETE a specific experience from a specific user
router.delete('/:id/experience/:expid', async (req,res)=>{
    try{
        console.log('deleting an experience from a user');
        const toDelete = await user.findByIdAndUpdate(req.params.id, 
            { $pull: {experience: {_id: new ObjectId(req.params.expid)}}    
        });
        res.send('Removed experience');
    } catch (err){
        console.log(err);
        res.status(500).send(err);
    }
})

module.exports = router; 
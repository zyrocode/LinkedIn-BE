const express = require('express');
const router = express.Router();
const path = require('path');
const user = require ('../models/users/index');


//USER
//GET all users
router.get('/', async (req,res)=>{
    const results = await user.find({})
    console.log('Fetching data');
    res.send(results);
})

//GET user by id
router.get('/:id', async (req,res)=>{
    const result = await user.findById(req.params.id);
    console.log('Fetching data by Id');
    res.send(result)
})

//POST user
router.post('/', async(req,res)=>{
    try{
        const result = await user.create(req.body);
        console.log('Posting data');
        res.send(result)
    } catch(err){
        res.send(err)
        console.log(err)
    }
})

//POST image for users Multer
// router.post('/:id/images',(req,res)=>{
    
// })

router.put('/:id', async(req,res)=>{
    try{
        console.log('editing data');
        delete req.body._id
        const edited = await user.findByIdAndUpdate(req.params.id, {$set: {...req.body}});
        if (edited) {
            res.send(edited);
        } else{
            res.status(404).send('user not found');
        }
    } catch(err){
        console.log(err)
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
        console.log(err)
        res.status(500).send('server error')
    }

    console.log('deleting data');
})

//Experience
router.get('/:id/experience', async(req,res)=>{
    const experience = await user.findById(req.body)
    console.log('Fetching all experience from a user');
})

router.post('/:id/experience/:expid', async (req,res)=>{
    console.log('fetching 1 experience from a user')
})

router.post('/:id/experience', async(req,res)=>{
    console.log('posting experience to a user');
})

router.put('/:id/experience/:expid', async(req,res)=>{
    console.log('editing an experience from a user')
})

router.delete('/:id/experience/:expid', async (req,res)=>{
    console.log('deleting an experience from a user');
})

module.exports = router; 
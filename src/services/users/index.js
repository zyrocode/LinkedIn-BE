const express = require('express');
const router = express.Router();

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
router.put('/:id', async(req,res)=>{
    try{
        const toEdit = user.findByIdAndUpdate(req.params.id, {$set: {...req.body}});
        res.send(toEdit);
        console.log('editing data');
    } catch(err){
        console.log(err)
    }
})

router.delete('/:id', async(req,res)=>{
    try{
        const deleted = user.findByIdAndDelete(req.params.id);
    } catch (err){
        console.log(err)
        res.status(500).send('server error')
    }

    console.log('deleting data');
})

//Experience
router.get('/:id/experience', async(req,res)=>{
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
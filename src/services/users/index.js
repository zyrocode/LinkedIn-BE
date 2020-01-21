const express = require('express');
const router = express.Router();


router.get('/', async (req,res)=>{
    console.log('fetching data');
    const users = await db.users.find({})
    res.send(users);
})

router.post('/', async (req,res)=>{
    console.log('posting data');
})

router.put('/:id', async(req,res)=>{
    console.log('editing data');
})

router.delete('/:id', async(req,res)=>{
    console.log('deleting data');
})


module.exports = router; 
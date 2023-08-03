const express = require('express');

const router = express.Router();

router.get('/', (req,res) => {
    console.log('Olá!');
    //res.send('olá');
    res.send('<h1>Olá mundo!</h1> </br> <h1>seja bem vindo! :)</h1>')
});

router.post('/', (req,res) =>{
    console.log(req.body);
    res.status(200).send(req.body);
});

router.get('/:id', (req, res) => {
    console.log(req.params.id);
    res.send(req.params.id);    
});

router.put('/:id', (req,res) => {
    console.log(req.params.id);
    res.send(`PUT ID: ${req.params.id}`);
});

router.delete('/:id', (req,res) => {
    console.log(req.params.id);
    res.send(`DELETE ID: ${req.params.id}`);
});

module.exports = router;
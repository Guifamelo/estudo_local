const express = require('express');
const app = express();
app.use(express.json());

const checkListRouter = require('./src/routes/checklist');
app.use('/checklist', checkListRouter);

/* 
const log = (req, res, next) => {
    console.log(req.body);
    console.log(`Data: ${Date.now()}`);
    next();
}
app.use(log);

app.get('/', (req, res) => {
    res.send('<h1>Olá mundo!</h1> </br> <h1>seja bem vindo! :)</h1>')
})

app.get('/carrinho', (req, res) => {
    res.send('<h3>Você seu carrinho tem ${n_itens} itens!</h3>')
})

app.get('/json', (req,res) => {
    console.log(req.body)
    res.json({titulo: "Tarefa X", concluido: true, horas: 5, complexidade: '3'})
})
*/

app.listen('3000', () => {
    console.log('servindo......');
})
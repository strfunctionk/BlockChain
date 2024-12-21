import express from 'express'
import {Blockchain} from './blockchain.js'

const app = express()
const port = 5000

let blockchain = new Blockchain();

app.get('/mine_block', (req, res) => {
    let previous_block = blockchain.get_previous_block();
    let previous_proof = previous_block.proof;
    let proof = blockchain.proof_of_work(previous_proof);
    let previous_hash = blockchain.hash(previous_block);
    let block = blockchain.create_block(proof, previous_hash);
    res.send({
        'message': 'Congratulation, you just mined a block!',
        'index': block.index,
        'timestamp': block.timestamp,
        'proof': block.proof,
        'previous_hash': block.previous_hash
    })
})

app.get('/get_chain', (req, res) => {
    res.send({
        'chain': blockchain.chain,
        'length': blockchain.chain.length
    })
})

app.get('/is_valid', (req, res) => {
    let is_valid = blockchain.is_chain_valid(blockchain.chain)
    let msg;
    is_valid ?
        msg = { 'message': 'All good. The Blockchain is valid.' }
        :
        msg = { 'message': 'Houston, we have a problem. The Blockchain is not valid.' };
    res.send(msg);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
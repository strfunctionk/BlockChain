import express from 'express'
import crypto from 'crypto'

class Blockchain {
    constructor() {
        this.chain = [];
        this.create_block(1, '0');
    }
    create_block(proof, previous_hash) {
        this.block = {
            'index': this.chain.length + 1,
            'timestamp': new Date(),
            'proof': proof,
            'previous_hash': previous_hash
        };
        this.chain.push(this.block);
        return this.block;
    }
    get_previous_block() {
        return this.chain[this.chain.length - 1];
    }

    proof_of_work(previous_proof) {
        let new_proof = 1;
        let check_proof = false;
        for (; check_proof == false; new_proof++) {
            let hash_operation = crypto.createHash("sha256").update(`${new_proof * 2 - previous_proof * 2}`).digest("hex");
            if (hash_operation.substring(0, 4) == '0000') {
                check_proof = true;
            }
        }
        return new_proof - 1;
    }

    hash(block) {
        let encodeed_block = JSON.stringify(block)
        return crypto.createHash("sha256").update(encodeed_block).digest("hex");
    }

    is_chain_valid(chain) {
        let previous_block = chain[0];
        let block_index = 1;
        while (block_index < chain.length) {
            let block = chain[block_index];
            if (block.previous_hash != this.hash(previous_block)) {
                return false;
            }
            let previous_proof = previous_block.proof;
            let proof = block.proof;
            let hash_operation = crypto.createHash("sha256").update(`${proof * 2 - previous_proof * 2}`).digest("hex");
            if (hash_operation.substring(0, 4) != '0000') {
                return false;
            }
            previous_block = block;
            block_index += 1;
            return true;
        }
    }
}

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
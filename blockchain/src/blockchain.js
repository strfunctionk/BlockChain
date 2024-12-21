import crypto from 'crypto'

export class Blockchain {
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
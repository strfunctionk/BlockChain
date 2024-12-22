import express from 'express'
import {
    get_chain,
    is_valid,
    mine_block
} from './patten.js'

const app = express()
const port = 5000

app.get('/mine_block', mine_block);
app.get('/get_chain', get_chain);
app.get('/is_valid', is_valid);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
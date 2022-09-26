const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');

// initialize the express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    // send the posts object as a response
    res.send(posts); 
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    // get the title from the request body with destructuring
    const {title} = req.body;

    // add the post to the posts object
    posts[id] = {
        id, title
    };

    // send a post request to the event bus
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {id, title},
    })

    // send the post object as a response
    res.status(201).send(posts[id]);
});

app.post('/events',(req,res)=>{
    console.log('Received Event', req.body.type);
    res.send({});
})

app.listen(4000,()=>{
    console.log("v2");
    console.log('Listening on 4000');
});
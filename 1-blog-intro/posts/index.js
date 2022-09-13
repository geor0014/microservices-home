const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');

// initialize the express app
const app = express();
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
    // send the posts object as a response
    res.send(posts); 
});

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex');
    // get the title from the request body with destructuring
    const {title} = req.body;

    // add the post to the posts object
    posts[id] = {
        id, title
    };

    // send the post object as a response
    res.status(201).send(posts[id]);
});

app.listen(4000,()=>{
    console.log('Listening on 4000');
});
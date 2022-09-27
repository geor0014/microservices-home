const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};


app.get('/posts/:id/comments',(req,res)=>{

    res.send(commentsByPostId[req.params.id] || []);
})

app.post('/posts/:id/comments', async(req,res)=>{
    const  commentId = randomBytes(4).toString('hex');

    const {content} = req.body;

    // if the post id is not in the commentsByPostId object, give an empty array
    const comments = commentsByPostId[req.params.id] || [];

    comments.push({id:commentId, content, status:'pending'});

    commentsByPostId[req.params.id] = comments;

   await axios.post('http://event-bus-srv:4005/events',{
        type: "CommentCreated",
        data: {id:commentId,content, postId: req.params.id, status:'pending'}
    })

    res.status(201).send(comments);
})

app.post('/events',async (req,res)=>{
    console.log('Received Event', req.body.type);

    const {type, data} = req.body;

    if(type === 'CommentModerated'){
        const {postId,id,status,content} = data;
        const comments = commentsByPostId[postId];

        // find the comment from the comments array
        const comment = comments.find(comment =>{
            // return the comment with the id that matches the id from the data object
            return comment.id === id;
        })
        // change the status of the comment to the status from the data object
        comment.status = status;

        // send an event to the event bus
        axios.post('http://event-bus-srv:4005/events',{
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        })
    }
    res.send({});
})

app.listen(4001,()=>{
    console.log('Listening on 4001');
})


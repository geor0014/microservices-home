const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// create an empty object to store the posts
const posts = {};

const handleEvent = (type, data) => {
    if(type === 'PostCreated'){
        // get the id and title of the post from the data object
        const {id, title} = data;
        // add the post to the posts object
        posts[id] = {id,title, comments: []};
    }

    if( type === 'CommentCreated'){
        // get the id, content, and postId from the data object
        const {id,content,postId, status} = data
        // get the post from the posts object with the postId
        const post = posts[postId];
        // add the comment to the post's comments array 
        post.comments.push({id,content,status});
    }

    if(type === 'CommentUpdated'){
        const {id, content, postId, status} = data;

        const post = posts[postId];
        const comment = post.comments.find(comment =>{
            return comment.id === id;
        })

        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts',(req,res)=>{

    // send the posts object as a response
    res.send(posts);
})


app.post('/events',(req,res)=>{
    const {type, data} = req.body;

    handleEvent(type,data);

    res.send({});
})

app.listen(4002, async ()=>{
    console.log('Listening on 4002');

    const res = await axios.get(`http://event-bus-srv:4005/events`);


    res.data.forEach(event => {
        console.log('Processing event:', event.type);

        handleEvent(event.type, event.data)
    });
})
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// create an empty object to store the posts
const posts = {};

app.get('/posts',(req,res)=>{

    // send the posts object as a response
    res.send(posts);
})


app.post('/events',(req,res)=>{
    const {type, data} = req.body;

    if(type === 'PostCreated'){
        // get the id and title of the post from the data object
        const {id, title} = data;
        // add the post to the posts object
        posts[id] = {id,title, comments: []};
    }

    if( type === 'CommentCreated'){
        // get the id, content, and postId from the data object
        const {id,content,postId} = data
        // get the post from the posts object with the postId
        const post = posts[postId];
        // add the comment to the post's comments array 
        post.comments.push({id,content});
    }

    console.log(posts);

    res.send({});
})

app.listen(4002,()=>{
    console.log('Listening on 4002');
})
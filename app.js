var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost/tk-blog');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get('/posts', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    })
});


app.get('/', function(req, res){
    res.redirect('/posts');
});

app.get('/posts/new', function(req, res){
    res.render('new');
})

app.post("/posts", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new')
        } else {
            res.redirect('/posts');
        }
    })
})

app.listen(process.env.PORT || 4000, function(){
    console.log('SERVER IS RUNNING');
});
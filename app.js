var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var mongoose = require('mongoose');
var app = express();

const URL = 'mongodb://admin:admin42@ds063134.mlab.com:63134/heroku_13h0wr5x';
// const URL = 'mongodb://localhost/tk-blog'
mongoose.connect(URL);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin",
        "https://tk-blog.herokuapp.com");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});



var Blog = mongoose.model("Blog", blogSchema);

app.get('/posts', function(req, res){
    Blog.find({}, function(err, blog){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blog: blog});
        }
    })
});


app.get('/', function(req, res){
    res.redirect('/posts');
});

app.get('/posts/new', function(req, res){
    res.render('new');
});

app.get('/posts/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundPost){
        if(err){
            res.redirect('/posts');
        } else {
            res.render('show', {post: foundPost});
        }
    });
});

app.get('/posts/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundPost){
        if (err) {
            res.redirect("/posts")
        } else {
            res.render('edit', {post: foundPost})
        }
    });
});


app.post("/posts", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new')
        } else {
            res.redirect('/posts');
        }
    })
})

app.put('/posts/:id', function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
        if (err) {
            res.redirect('/posts');
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

app.delete('/posts/:id', function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/posts');
        } else {
            res.redirect('/posts');

        }
    })
})

app.listen(process.env.PORT || 4000, function(){
    console.log('SERVER IS RUNNING');
});
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/restful_blog_app",{
	useNewUrlParser: true, useUnifiedTopology: true
});



app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    image: String,
    created:  {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: []}); 
        }
    })
});

app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   var formData = req.body.blog;
   Blog.create(formData, function(err, newBlog){
       console.log(newBlog);
      if(err){
          res.render("new");
      } else {
          res.redirect("/blogs");
      }
   });
});

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
      if(err){
          res.redirect("/");
      } else {
          res.render("show", {blog: blog});
      }
   });
});

app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
           res.redirect("/")
       } else {
           res.render("edit", {blog: blog});
       }
   });
});

app.put("/blogs/:id", function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
       if(err){
           console.log(err);
       } else {
         var showUrl = "/blogs/" + blog._id;
         res.redirect(showUrl);
       }
   });
});

app.delete("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
       } else {
           blog.remove();
           res.redirect("/blogs");
       }
   }); 
});

//MONGOOSE/MODEL CONFIG
/*var blogSchema = new mongoose.Schema({
			title: String,
			image: String,
			body: String,
			created: {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//ROUTES

app.get("/", function(req,res){
	res.redirect("/blogs");
});

//Index Route
app.get("/blogs", function(req,res){
	Blog.find({}, function(err,blogs){
		if(err){
			console.log("ERRORS")
		} else{
			res.render("index", {blogs: blogs});
		}
	});
});


//New Route
app.get("/blogs/new", function(req,res){
	res.render("new");
});

//Create Route
app.post("/blogs", function(req,res){
	//create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else{
			res.redirect("/blogs");
		}
	});
});


//Show Route
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("show", {blog: foundBlog});
		}
	});
});


//Edit Route
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("edit", {blog: foundBlog});
		}
	});

});

//Update Route
app.put("/blogs/:id", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs" + req.params.id);
		}
	});
});


//Delete Route
app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	});
});*/


/*title
image
body
created*/



app.listen(3100, function(){
	console.log("The Server has Started");
});
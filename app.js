var express= require("express");
var app= express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//SCHEMA SETUP


 var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String, 
	description: String
})

var Campground = mongoose.model("Campground",campgroundSchema);

/* Campground.create({
	name: "Mountain Hill" ,
	image: "https://s3.amazonaws.com/imagescloud/images/medias/camping/camping-tente.jpg",
	description: "This is a huge Hill, With a lakeview and Campfire options"
	
}, function(err, campground){
	if(err){
		console.log(err);
	}else{
		console.log("New Listing Added");
		console.log( campground);
	}
}) */






app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req,res){
	res.render("landing");
})


/* var campgrounds = [
		{name: "Salmon Creek" , image: "https://koa.com/blog/images/10-Tips-for-Tent-Camping.jpg?preset=blogPhoto"},	
		{name: "Salmon tub" , image: "https://koa.com/blog/images/solo-camping-tips.jpg?preset=blogPhoto"},
		{name: "Mountain Hill" , image: "https://s3.amazonaws.com/imagescloud/images/medias/camping/camping-tente.jpg"},
		{name: "Salmon Creek" , image: "https://koa.com/blog/images/10-Tips-for-Tent-Camping.jpg?preset=blogPhoto"},	
		{name: "Salmon tub" , image: "https://koa.com/blog/images/solo-camping-tips.jpg?preset=blogPhoto"},
		{name: "Mountain Hill" , image: "https://s3.amazonaws.com/imagescloud/images/medias/camping/camping-tente.jpg"},
		{name: "Salmon Creek" , image: "https://koa.com/blog/images/10-Tips-for-Tent-Camping.jpg?preset=blogPhoto"},	
		{name: "Salmon tub" , image: "https://koa.com/blog/images/solo-camping-tips.jpg?preset=blogPhoto"},
		{name: "Mountain Hill" , image: "https://s3.amazonaws.com/imagescloud/images/medias/camping/camping-tente.jpg"},
		
	] */


app.get("/campgrounds", function(req,res){
	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err)
		} else{
			res.render("index",{campgrounds:allCampgrounds});
		}
	})	
})

app.post("/campgrounds", function(req,res){
	//get data from the from & add that to the campgrounds
	var name= req.body.name;	
	var image= req.body.image;	
	var description= req.body.description;

	var newCampground = {name:name , image:image , description:description } ;
	Campground.create(newCampground, function(err,newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds");
		}
	})
	
	
})


app.get("/campgrounds/new", function(req,res){
	res.render("new");
});

// Show -- shows more info about the campground

app.get("/campgrounds/:id", function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err)
		} else{
			res.render("show", {campground:foundCampground});
		}
	});
		
})



app.listen(3000, function(req,res){
	console.log("YelpCamp server has started");
})
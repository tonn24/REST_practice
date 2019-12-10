const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/Wikidb", {useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);
//Requests targeting all articles

app.route("/articles")
.get((req, res) => {
    Article.find(function(err, foundArticles){
        if(err){
            res.send(err);
        }else{
            res.send(foundArticles);
        } 
    });
})
.post((req, res) => {
    
    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    });
    newArticle.save((err) => {
        if(!err){
            res.send("Successfully added a new artcle!")
        } else {
            res.send(err);
        }
    });
})
 .delete((req, res) => {
    Article.deleteMany((err) => {
        if(!err){
            res.send("Succesfully deleted all articles!");
        } else {
            res.send(err);
        }
    });
});

//Reguests targeting specific articles
app.route("/articles/:articleTitle")
.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No articles found!")
        }
    });
})
.put((req, res) => {
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err) => {
            if(!err){
                res.send("Successfully updated article");
            } else {
                res.send("Works!");
            }
        }
    );
})

.patch((req, res) => {
    
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err) => { //Callback
            if(!err){
                res.send("Successfully updated articles!");
            } else {
                res.send(err);
            }
        }
    );
})

.delete((req, res) => {
    Article.deleteOne(
        {title: req.params.articleTitle},
        (err) => {
            if(!err){
                res.send("Successfully deleted item!");
            }  else {
                res.send(err);
            }
        }
    )
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
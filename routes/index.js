const cheerio = require("cheerio")
const axios = require("axios")
const db = require('../models')

module.exports = (app) => {
  //Scrapes reddit
  app.get('/scrape', function(req, res) {
    axios.get("http://www.reddit.com/")
    .then(r => {
      const $ = cheerio.load(r.data)
      let results = []
      $('._1poyrkZ7g36PawDueRza-J').each((i, elem) => {
        //returns 12 articles
        if (i>11) return false
        const result = {}
        result.title = `${$(elem).find('h2').text()}`
        result.link = `http://reddit.com/${$(elem).find('.SQnoC3ObvgnGjWt90zD9Z').attr('href')} \n`
        //this takes into account differnt locations of images, if video or no picture
        if (`${$(elem).find('._2_tDEnGMLxpM6uOa2kaDB3').attr('src')}` !== 'undefined') {
          result.image = `${$(elem).find('._2_tDEnGMLxpM6uOa2kaDB3').attr('src')}`
        } else if (`${$(elem).find('._2c1ElNxHftd8W_nZtcG9zf').attr('style')}` !== 'undefined') {
          let link = `${$(elem).find('._2c1ElNxHftd8W_nZtcG9zf').attr('style')}`
          let index1 = link.indexOf('h')
          let index2 = link.indexOf(')')
          result.image = link.slice(index1, index2)
        } else if (`${$(elem).find('.m3aNC6yp8RrNM_-a0rrfa ').attr('data-click-id')}` === 'media') {
          result.image = './images/video.jpg'
        } else {
          result.image = './images/none.png'
        }
        result.subreddit = `${$(elem).find('.s1i3ufq7-0').text()}`
        results.push(result)
      })
      res.send(results)
    }).catch(e => {
      console.log(e)
    })
  })

  //Get's articles from database and returns info
  app.get('/articles', function(req,res) {
    db.Article.find()
    .then(function (dbArticle) {
      res.json(dbArticle)
    }).catch(e => {
      console.log(e)
    })
  })

  //Saves articles to database
  app.post('/articles', function(req, res) {
    db.Article.create({
      title: req.body.title,
      link: req.body.link,
      image: req.body.image,
      subreddit: req.body.subreddit
    }).then(function (dbArticle) {
      res.json(dbArticle)
    }).catch(e => {
      console.log(e)
    })
  })

  //Delete article and it's notes from database
  app.delete("/articles/:id", function (req, res) {
    // db.Note.deleteMany({ articles_id: req.params.id })
    // .then(function(dbNote) {
    db.Article.deleteOne({ _id: req.params.id })
    .then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(e => {
      console.log(e)
    })
  })

  //save note
  app.post('/notes/:id', function(req, res) {
    db.Note.create(req.body)    
    .then(function(dbNote) {
      db.Article.findOneAndUpdate( 
        { _id: req.params.id },
        { $set: { note: dbNote._id }}, 
        { new: true },
        function (err, doc) {
          if (err) {console.log(err)}
        }
      );
    }).then(function () {
      res.json("done")
    }).catch(e => {
      console.log(e)
    })
  })

  //Get notes from database for article
  app.get('/notes/:id', function(req,res) {
    db.Note.aggregate([
       { $match : { articles_id : req.params.id} }
    ]).then(function (dbNote) {
      res.json(dbNote)
    }).catch(e => {
      console.log(e)
    })
  })

  //Deleta note from database
  app.delete("/notes/:id", function (req, res) {
    db.Note.deleteMany({ articles_id: req.params.id })
    .then(function (dbNote) {
        res.json(dbNote);
    }).catch(e => {
      console.log(e)
    })
  })

}
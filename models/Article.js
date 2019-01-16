var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    subreddit: {
        type: String,
        required: false
    },
    note: {
        type: String,
        required: false
    }
})

var Article = mongoose.model("Article", ArticleSchema)

module.exports = Article
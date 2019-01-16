var mongoose = require("mongoose")

var Schema = mongoose.Schema

var NoteSchema = new Schema({
  title: String,
  author: String,
  body: String,
  articles_id: String
})

var Note = mongoose.model("Note", NoteSchema)

module.exports = Note

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  byline: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: "Summary unavailable."
  },
  img: {
    type: String,
    default: "/assets/images/unavailable.jpg"
  },
  saved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: "Save Article"
  },
  created: {
    type: Date,
    default: Date.now
  },
  notes: [
    {
    type: Schema.Types.ObjectId,
    ref: "Note"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;

const mongoose = require('mongoose');

const Recipe = new mongoose.Schema({
  title: String,
  category: String,
  shortDesc: String,
  longDesc: String,
	createdAt: String,
	updatedAt: String,
  user_id: mongoose.Schema.Types.ObjectId,
  user_likes_arr: [mongoose.Schema.Types.ObjectId],
}, {
	versionKey: false
});

module.exports = mongoose.model('Recipe', Recipe);

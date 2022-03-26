const mongooes = require("mongoose");
const token = new mongooes.Schema({
  userId: {
    type: String,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});
module.exports = mongooes.model("token", token);

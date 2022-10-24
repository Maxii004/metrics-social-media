const { Schema, model } = require("mongoose");

const CompetitorSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  socialMedia: [
    {
      name: String,
      url: String,
    },
  ],
});

const Competitor = model("Competitor", CompetitorSchema);

module.exports = Competitor;

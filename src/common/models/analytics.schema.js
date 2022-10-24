const { Schema, model } = require("mongoose");

const AnalyticsSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  createAt: {
    type: Date,
  },
  analytics: [
    {
      competitor: {
        type: String,
      },
      socialMedia: {
        twitter: {
          type: String,
        },
        youtube: {
          type: String,
        },

        facebook: {
          type: String,
        },
        instagram: {
          type: String,
        },
      },
      website: {
        mangools: {
          majestic: {
            CitationFlow: {
              type: Number,
            },
            TrustFlow: {
              type: Number,
            },
          },
        },
      },
    },
  ],
});

const Analytics = model("Analytics", AnalyticsSchema);

module.exports = Analytics;

const express = require("express");
const getFacebookMetrics = require("./src/facebook-api");
const getTwitterMetrics = require("./src/twitter-api");
const getYoutubeMetrics = require("./src/youtube-api");
const getMangoolsMetrics = require("./src/mangools-api");
const Competitor = require("./src/common/models/competitor.schema");
const Analytic = require("./src/common/models/analytics.schema");
require("./src/common/db")();
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5001; // default port to listen

app.get("/count/:clientId", async (req, res) => {
  let clientId = null;
  if (req.params.clientId) {
    clientId = req.params.clientId;
    console.log("clientId: " + clientId);
  } else {
    res.json("No clientId provided");
    // return {
    //   statusCode: 400,
    //   //headers: responseHeaders,
    //   body: JSON.stringify({
    //     message: "No important parameters found",
    //   }),
    // };
  }

  // website analytics results
  let mangoolsMetrics = "";

  // competitor analytics array for response
  const Analytics = [];

  try {
    // get all competitors from db
    const competitors = await Competitor.find({ clientId }).exec();

    //check if competitors exist
    if (competitors.length === 0) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({
          message: "No competitors found",
        }),
      };
    }

    // get metrics for each competitor
    for (let i = 0; i < competitors.length; i++) {
      const competitor = competitors[i];

      // social media  analytics results
      let twitterMetrics = "";
      let youtubeMetrics = "";
      let facebookMetrics = "";

      //---------------------------------------------------------------------------
      // social media metrics for
      // facebook, instagram, linkedin, twitter, youtube

      const competitorsSocialMedia = competitor.socialMedia;

      // check if competitor has Twitter
      const twitter = competitorsSocialMedia.find(
        (socialMedia) => socialMedia.name === "Twitter"
      );

      // check if competitor has Youtube
      const youtube = competitorsSocialMedia.find(
        (socialMedia) => socialMedia.name === "YouTube"
      );

      // check if competitor has Facebook
      const facebook = competitorsSocialMedia.find(
        (socialMedia) => socialMedia.name === "Facebook"
      );

      // get twitter metrics
      if (twitter?.url) {
        twitterMetrics = await getTwitterMetrics(twitter.url);
      }

      // get youtube metrics
      if (youtube?.url) {
        youtubeMetrics = await getYoutubeMetrics(youtube.url);
      }

      // get facebook metrics
      if (facebook?.url) {
        facebookMetrics = await getFacebookMetrics(facebook.url);
        console.log(facebookMetrics, 'index js - facebook metrics');
      }

      //---------------------------------------------------------------------------
      // website analytics

      const competitorsWebsite = competitor.website;

      if (competitorsWebsite) {
        mangoolsMetrics = await getMangoolsMetrics(competitorsWebsite);
      }

      Analytics.push({
        competitor: competitor.name,
        socialMedia: {
          twitter: twitterMetrics,
          youtube: youtubeMetrics,
          facebook: facebookMetrics,
        },
        website: {
          mangools: mangoolsMetrics,
        },
      });
    }

    //save analytics to db
    await Analytic.create({
      clientId,
      createAt: new Date(),
      analytics: Analytics,
    });
    res.json(Analytics);
    // return {
    //   statusCode: 200,
    //   // headers: responseHeaders,
    //   body: JSON.stringify('ok'),
    //   isBase64Encoded: false,
    // };
  } catch (e) {
    console.log(e);
    res.json(e);
    // return {
    //   statusCode: 400,
    //   // headers: responseHeaders,
    //   body: JSON.stringify("Error"),
    //   isBase64Encoded: false,
    // };
  }
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

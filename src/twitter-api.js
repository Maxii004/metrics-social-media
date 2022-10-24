const axios = require("axios");
require('dotenv').config();
const { TWITTER_TOKEN } = process.env;

const getTwitterMetrics = async (twitterUrl) => {
  const twitterUsername = twitterUrl.split("//")[1].split("/")[1];

  const twitterConverterUrl = `https://api.twitter.com/2/users/by/username/${twitterUsername}?user.fields=public_metrics`;

  try {
    const res = await axios.get(twitterConverterUrl, {
      headers: {
        Authorization: `Bearer ${TWITTER_TOKEN}`,
      },
    });
    const response = await res.data;

    const followersCount = await response?.data.public_metrics.followers_count;

    return followersCount;
  } catch (err) {
    return "-";
  }
};

module.exports = getTwitterMetrics;

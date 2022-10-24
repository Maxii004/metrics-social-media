const axios = require("axios");
const cheerio = require("cheerio");
const { google } = require("googleapis");
require('dotenv').config();
const { YOUTUBE_TOKEN } = process.env;

const axiosInstance = axios.create({
  validateStatus: () => {
    return true;
  },
});

/**
 * Check YouTube Url
 *
 * @param {string} url
 * @returns {boolean}
 */
const checkUrl = (url) =>
  url.indexOf("youtube.com") !== -1 || url.indexOf("youtu.be") !== -1;

/**
 * Get YouTube Channel ID By Url
 *
 * @param {string} url Channel Url
 * @returns {Promise<string>} Channel ID
 */
const ChannelId = async (url) => {
  if (checkUrl(url)) {
    const ytChannelPageResponse = await axiosInstance.get(url);
    const $ = cheerio.load(ytChannelPageResponse.data);

    const id = $('meta[itemprop="channelId"]').attr("content");
    if (id) {
      return id;
    }
  } else {
    throw Error(`"${url}" is not a YouTube url.`);
  }

  throw Error(`Unable to get "${url}" channel id.`);
};

const getYoutubeMetrics = async (Url) => {
  let channelId = null;
  try {
    channelId = await ChannelId(Url);

    const youtube = google.youtube({ version: "v3", auth: YOUTUBE_TOKEN });

    const res = await youtube.channels.list({
      auth: YOUTUBE_TOKEN,
      part: "snippet,contentDetails,statistics",
      id: channelId,
    });

    if (res.data.items.length > 0) {
      // convert to number
      const subscriberCount = parseInt(
        res.data.items[0].statistics.subscriberCount
      );
      return subscriberCount;
    }

    return "No channel found";
  } catch (error) {
    return error;
  }
};

module.exports = getYoutubeMetrics;

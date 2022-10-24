const axios = require("axios");
require('dotenv').config();
const { MANGOOLS_TOKEN } = process.env;

const getMangoolsMetrics = async (url) => {
  const mangoolsURL = `https://api.mangools.com/v3/siteprofiler/overview?url=${url}`;

  const res = await axios.get(mangoolsURL, {
    headers: {
      "X-access-Token": MANGOOLS_TOKEN,
    },
  });

  const siteProfilerData = await res.data;

  return siteProfilerData;
};

module.exports = getMangoolsMetrics;

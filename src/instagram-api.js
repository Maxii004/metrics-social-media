require('dotenv').config();
const { spawn } = require('child_process');

const getInstaMetrics = async (instaUrl) => {

  try {
    console.log(instaUrl, 'insta link from index');
    const pyOne = spawn('python', ['count.py', instaUrl]);
    pyOne.stdout.on('data',function (data) {
          let data1 = data.toString();
          console.log(`Ïnside pyOne.stdout.on data1 has been assigned to ${data1}`);
          console.log(`Ïnside pyOne.stdout.on instagram has been assigned to ${data1}`);
          sendCount(data1);
      })
    pyOne.on('close', (code) => {
      console.log(code);
    })
    function sendCount(followersCount) {
      console.log(`Inside sendCount data1 is ${followersCount}`);
      return followersCount;
    }

  } catch (err) {
    return "-";
  }
};

module.exports = getInstaMetrics;

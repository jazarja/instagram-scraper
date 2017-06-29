const request = require('request-promise');

const getUserData = username => {
  return request({
      url: `https://www.instagram.com/${username}/?__a=1`
  }).then(JSON.parse)
}

module.exports = {
  getUserData
}

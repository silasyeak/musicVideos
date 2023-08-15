const https = require('https');
const fs = require('fs');

// Load Spotify client credentials from config.json
const properties = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const clientId = properties['spotify.clientId'];
const clientSecret = properties['spotify.clientSecret'];

const apiUrl = 'https://accounts.spotify.com/api/token';
const encodedGrantType = 'grant_type=' + encodeURIComponent('client_credentials');
const encodedClientId = 'client_id=' + encodeURIComponent(clientId);
const encodedClientSecret = 'client_secret=' + encodeURIComponent(clientSecret);
const postData = encodedGrantType + '&' + encodedClientId + '&' + encodedClientSecret;

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const req = https.request(apiUrl, options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const accessToken = JSON.parse(data).access_token;
    console.log('Access Token:', accessToken);

    // Save the access token to config.js
    const configData = `module.exports = { accessToken: '${accessToken}' };`;
    fs.writeFileSync('configSpotifyToken.js', configData);

    // Alternatively, you can save the access token to another JSON config file
    // const newConfig = { accessToken: accessToken };
    // fs.writeFileSync('new_config.json', JSON.stringify(newConfig, null, 2));
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(postData);
req.end();

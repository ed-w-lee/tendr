const https = require('https');
const request = require('request');
const express = require('express');
const app = express();

var access_token;

function getAccessToken() {

console.log("Refreshing access token.");
request.post({
        url: 'https://api.yelp.com/oauth2/token',
        form: {
            'grant_type': 'client_credentials',
            'client_id': 'tsYR9jjLiEoaotIle_xObg',
            'client_secret': 'hOhPOYhcJTSXmhgWQn9fG6cceedbjR18s3Z3Y8vV1D5szAXgIsYudgeUYFo3931W'
        }
    }, function (err, httpResponse, body) {
        access_token = JSON.parse(body)['access_token'];
    });
}

getAccessToken();
var requestLoop = setInterval(function() {getAccessToken()}, 60 * 60 * 10 * 1000);


app.get('/', (req, res) => {
    console.log("Received request");
    request.get({
        url: 'https://api.yelp.com/v3/businesses/search',
        qs: {
            'latitude': req.query.latitude,
            'longitude': req.query.longitude,
            'categories': 'chickenshop,chicken_wings,rotisserie_chicken',
            'open_now': true
        },
        headers: {
            'Authorization': "Bearer " + access_token
        }
    }, function(err, response, body) {
        if (err) {
            console.log(err);
            res.status(500).send('Something broke!');
            return;
        }
        res.status(200).send(body);
    });
});

app.listen(3000, '0.0.0.0', function() {
    console.log('Listening to port: ' + 3000);
});

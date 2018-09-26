const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);

// Make all redis commands promises 
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


const path = require('path');
var express = require('express')
var app = express();
var axios = require('axios');

app.use('/static', express.static('build/static'));
app.use('/build', express.static('build'));


app.get('/get_weather_data/:unix_time', function (req, res) {
    var unix_time = req.params.unix_time; //CHANGE
    var redis_key =  `dark-sky-cache-${unix_time}`;
    redisClient.getAsync(redis_key).then(weatherData => {
        if(weatherData){
            console.log('cached data', unix_time)
            res.send(JSON.parse(weatherData))
        }else {
            axios.get(`https://api.darksky.net/forecast/${process.env.REACT_APP_DARK_SKY_API_KEY}/45.5898,-122.5951,${unix_time}?exclude=currently,flags,hourly`).then((data_response) => {
                console.log('calling this external api')
                redisClient.set(redis_key, JSON.stringify(data_response.data))
                res.send(data_response.data);
            });
        }
    })
})

app.get('/*', function (req, res) {
    console.log("in star")
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 3002);


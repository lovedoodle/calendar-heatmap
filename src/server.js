var express = require('express')
var app = express();
var moment = require('moment');
var axios = require('axios');

app.get('/get_weather_data/:unix_time', function (req, res) {
    var unix_time = req.params.unix_time; //CHANGE
    axios.get(`https://api.darksky.net/forecast/${process.env.REACT_APP_DARK_SKY_API_KEY}/45.5898,-122.5951,${unix_time}?exclude=currently,flags,hourly`).then((data_response) => {
        res.send(data_response.data);
    });
})

app.listen(3002)
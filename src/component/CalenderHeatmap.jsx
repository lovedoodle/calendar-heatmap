import React, {Component} from 'react';
import moment from 'moment';
import axios from 'axios'

export default class CalenderHeatmap extends Component {
    constructor(props){
        super(props);
        this.state={
            data: []
        }
    }

    componentDidMount(){
        // moment.js month method accept number from 0-11, so here May use number 4
        var choosen_month = 4;
        var currentDay = moment(`2018-${choosen_month + 1}-01`, 'YYYY-M-DD');
        var days = [];
        while (currentDay.month() === choosen_month) {
            days.push(moment(currentDay))
            currentDay = moment(currentDay).add(1, 'days');
        }
        var data_defs = days.map(day => {
            var unix_time = day.unix();
            return axios.get(`/get_weather_data/${unix_time}`).then((c)=> {return c.data});
        })
        Promise.all(data_defs).then(array_of_daily_weather =>{
            console.log(array_of_daily_weather)
            //format an array of daily ac and heat on data 
            var result = array_of_daily_weather.map(weather => {
                var r = new Object();
                r.date = moment(weather.daily.data[0].time).format('yyyy-mm-dd')
                if (weather.daily.data[0].temperatureHigh > 75 && weather.daily.data[0].temperatureLow < 62) {
                    r.count = 4
                } else if (weather.daily.data[0].temperatureHigh > 75 && weather.daily.data[0].temperatureLow >= 62) {
                    r.count = 3
                } else if (weather.daily.data[0].temperatureHigh <= 75 && weather.daily.data[0].temperatureLow < 62) {
                    r.count = 2
                } else {
                    r.count =1;
                }
                return r
            })
            this.setState({
                data: result
            })
            console.log(this.state)
        })
    }
    render() {
        return (<div>
            Hello World
            
        </div>)
    }
}
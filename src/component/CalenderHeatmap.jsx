import React, {Component} from 'react';
import moment from 'moment';
import axios from 'axios';
import ReactCalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ReactTooltip from 'react-tooltip';

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
            //format an array of daily ac and heat on objects 
            //for example {date: "2018-05-01", count: 2}
            //range from 1-4, 1 when either ac/heat on, 2 when heat on, 3 when ac on, 4 both heat and ac on 
            var result = array_of_daily_weather.map(weather => {
                var r = {};
                r.date = moment.unix(weather.daily.data[0].time).format('YYYY-MM-DD')
                if (weather.daily.data[0].temperatureHigh > 75 && weather.daily.data[0].temperatureLow < 62) {
                    r.count = 3
                } else if (weather.daily.data[0].temperatureHigh > 75 && weather.daily.data[0].temperatureLow >= 62) {
                    r.count = 2
                } else if (weather.daily.data[0].temperatureHigh <= 75 && weather.daily.data[0].temperatureLow < 62) {
                    r.count = 1
                } else {
                    r.count = null;
                }
                return r
            });

            this.setState({
                data: result
            })
            console.log(this.state.data);
        })
    }
    render() {
        return (<div className="heat-map">
            {this.state.data.length > 0 ? (
                <div>
                    <ReactCalendarHeatmap
                        startDate={new Date('2018-04-30')}
                        endDate={new Date('2018-05-31')}
                        values={this.state.data}
                        classForValue={(value) => {
                            if (!value) {
                                console.log('found empty', value)
                                return 'color-empty';
                            }
                            return `color-scale-${value.count}`;
                        }}
                        tooltipDataAttrs={value => {
                            var result;
                            if(value.count === 3) {
                                result = 'AC/Heat On'
                            }else if (value.count === 2) {
                                result = 'AC On'
                            }else if(value.count === 1) {
                                result = 'Heat On'
                            }else {
                                result ='AC/Heat Off'
                            }
                            return {
                                'data-tip': `${value.date}: ${
                                    result
                                    }`,
                            };
                        }}
                        showWeekdayLabels={true}
                        horizontal={false}
                    />
                    <ReactTooltip />
                </div>                
            ) : (
                <div>Loading</div>
            )} 
            <div className='color-icon green'></div>AC/Heat on<div className='color-icon red'></div>Heat on<div className='color-icon blue'></div>AC on
        </div>)
    }
}
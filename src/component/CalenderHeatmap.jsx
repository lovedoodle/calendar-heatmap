import React, {Component} from 'react';
import moment from 'moment';

export default class CalenderHeatmap extends Component {
    constructor(props){
        super(props);
        this.state={
            data: []
        }
    }

    componentDidMount(){
        var choosen_month = 5;
        // use moment daysInMonth method to get how many days in a given month
        var firstDay = moment('2018-05-01');
        var days = [];
        var currentDay = firstDay;
        days.push(firstDay);
        do {
            currentDay = currentDay.addDays();
            days.push(moment(currentDay))
        } while (currentDay.month() === choosen_month)
        console.log(days)
        // console.log(firstDay)
        // var i;
        // for(i = 0; i < daysInMay; i++) {


        // }

    }
    render() {
        return (<div>
            Hello World
            
        </div>)
    }
}
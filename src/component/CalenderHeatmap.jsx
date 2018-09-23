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
        // moment.js month method accept number from 0-11, so here May use number 4
        var choosen_month = 4;
        var currentDay = moment(`2018-${choosen_month + 1}-01`, 'YYYY-M-DD');
        var days = [];
        while (currentDay.month() === choosen_month) {
            days.push(moment(currentDay))
            currentDay = moment(currentDay).add(1, 'days');
        } 
    }
    render() {
        return (<div>
            Hello World
            
        </div>)
    }
}
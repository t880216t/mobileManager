import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
// import events from './events'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { connect, history } from 'umi';

const localizer = momentLocalizer(moment)

@connect(({ stock, loading }) => ({
  stock,
  loading: loading.models.stock,
}))
export default class Page extends Component {
  constructor() {
    super();
    this.state={
      events: [],
    }
  }

  componentDidMount() {
    const date = new Date();
    const now_year = date.getFullYear();
    const now_month = date.getMonth() + 1;
    this.queryStockEvents(now_year, now_month)
  }

  queryStockEvents=(year, month, day=null, eventType=null)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'stock/queryStockEvents',
      payload: {
        year, month, day, eventType
      }
    }).then(()=>{
      const {events} = this.props.stock
      const originalEvents = []
      events.forEach(item => {
        originalEvents.push({
          ...item,
          start: new Date(Date.parse(item.start)),
          end: new Date(Date.parse(item.end)),
        })
      })
      this.setState({events: originalEvents})
    })
  }

  render(){
    const {events} = this.state;
    const CalendarToolbar = ({ onView, label, views }) => (
      <div>
        <h2>
          {label}
        </h2>
        {views.map(view => (
          <button
            key={view}
            type="button"
            onClick={() => onView(view)}
          >
            月
          </button>
        ))}
      </div>
    );
    return(
      <div>
        <Calendar
          localizer={localizer}
          events={events}
          // components={{
          //   toolbar: CalendarToolbar,
          // }}
          startAccessor="start"
          endAccessor="end"
          style={{height: '100vh'}}
        />
      </div>
    )
  }
}

import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import {Card, Button, Space} from 'antd'
// import events from './events'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { connect, history } from 'umi';
import 'moment/locale/zh-cn';
// 将日历选择为国际化
moment.locale('zh-cn');
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

  custom_event = ({ event }) => {
    return (
      <span>
        <strong>{event.title}</strong>
        {event.ts_code && `【${event.ts_code}】`}
        {event.desc && ':  ' + event.desc}
      </span>
      )
  }

  render(){
    const {events} = this.state;
    const {loading} = this.props
    const CalendarToolbar = ({ onView, label, views }) => (
      <Card
        bordered={false}
        title={
          <h2>{label}</h2>
        }
        extra={
          <Space>
            {views.map(view => (
              <Button
                size="large"
                key={view}
                onClick={() => onView(view)}
              >
                {view==='month' && '月度'}
                {view==='agenda' && '议程'}
              </Button>
            ))}
          </Space>
        }
      />
    );
    return(
      <Card loading={loading}>
        <Calendar
          localizer={localizer}
          events={events}
          components={{
            event: this.custom_event,
            toolbar: CalendarToolbar,
          }}
          views={['month','agenda']}
          startAccessor="start"
          endAccessor="end"
          style={{height: '100vh'}}
          onSelectSlot={e=>console.log(e)}
        />
      </Card>
    )
  }
}

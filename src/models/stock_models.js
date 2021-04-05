import { stringify } from 'querystring';
import { history } from 'umi';
import { queryStockEvents } from '@/services/stock_api';
const Model = {
  namespace: 'stock',
  state: {
    events: [],
  },
  effects: {
    *queryStockEvents({ payload }, { call, put }) {
      const response = yield call(queryStockEvents, payload);
      yield put({ type: 'updateState', payload: { events: response.content.events } });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;

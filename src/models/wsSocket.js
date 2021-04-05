import {
  initSocket,
} from '@/services/wsApi';

const Model = {
  namespace: 'wsSocket',
  state: {
    avatar: null,
    configData: {},
    messageData: {id: null, message: null},
    messageList: []
  },
  subscriptions: {
    // socket({ dispatch }) { // socket相关
    //   return initSocket(data => {
    //     switch (data.command) {
    //       case 'push_message':
    //         dispatch({
    //           type: 'setServerMessage',
    //           payload: data.content,
    //         })
    //         break;
    //       case 'set_config':
    //         dispatch({
    //           type: 'setConfig',
    //           payload: data.content,
    //         })
    //         break;
    //     }
    //   })
    // },
  },
  effects: {
    *setConfig({ payload }, { put }) {
      console.log('payload', payload)
      yield put({ type: 'updateState', payload: { configData: payload } });
    },
    *setServerMessage({ payload }, { put, select }) {
      const messageList = yield select(
        state => state.wsSocket.messageList
      );
      if(messageList){
        messageList.push(payload)
      }else {
        console.log('error', messageList)
      }
      yield put({ type: 'updateState', payload: { messageData: payload, messageList } });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;

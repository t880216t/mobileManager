import io from 'socket.io-client';

let socket = '';

export function initSocket(action) {
  const urlHost = 'localhost:5000';
  if (socket && socket.connected) {
    return
  }
  socket = io(`ws://${urlHost}/ws`);
  console.log('=> 连接服务器...');
  socket.on('connect', () => {
    console.log('<= 连接服务器成功！');
  });
  socket.on('disconnect', () => {
    console.log('=> 断开服务器成功！');
  });
  socket.on('server_response', (data) => {
    const jsonData = JSON.parse(data)
    action({
      type: 'server_response',
      ...jsonData,
    });
  });
}
